import { eq } from "drizzle-orm";
import { db } from "../db";
import { workflows, type WorkflowActionInput } from "../db/schema";
import { ActionFactory, type WorkflowActions } from "./actions/action-factory";

interface IWorkflowEngine {
  run(workflowId: number): Promise<null>;
}

export class WorkflowEngine implements IWorkflowEngine {
  async run(workflowId: number) {
    const workflow = await db.query.workflows.findFirst({
      where: (workflows, { eq }) => eq(workflows.id, workflowId),
      with: {
        edges: true,
        steps: {
          with: {
            action: true,
          },
        },
      },
    });

    const stepMap = new Map(workflow?.steps.map((step) => [step.id, step]));
    const edges = workflow?.edges;

    if (!workflow || !edges) return null;

    const executionOrder = topologicalSort(workflow.steps, edges);

    const stepOutputs: Record<number, unknown> = {};

    for (const stepId of executionOrder) {
      const step = stepMap.get(stepId);

      if (!step) return null;

      const resolvedInputs = resolveStepInputs(step.config, stepOutputs);

      step.config.map((input) => ({
        ...input,
        value: resolvedInputs[input.name],
      }));

      const action = ActionFactory.InitAction(
        step.action.name as WorkflowActions,
        step
      );

      const output = await action?.execute();

      stepOutputs[stepId] = output;
    }

    return null;
  }
}

function resolveStepInputs(
  config: WorkflowActionInput[],
  stepOutputs: Record<number, any>
): Record<string, any> {
  const resolved: Record<string, any> = {};

  for (const input of config) {
    switch (input.type) {
      case "string":
      case "number":
      case "boolean":
      case "array":
        // For static values, assume you have a .value property or similar
        resolved[input.name] = (input as any).value;
        break;
      case "stepOutput":
        resolved[input.name] = stepOutputs[input.stepId]?.[input.outputKey];
        break;
    }
  }

  return resolved;
}

function topologicalSort(
  steps: { id: number }[],
  edges: { sourceStepId: number; targetStepId: number }[]
): number[] {
  const inDegree = new Map<number, number>();
  const adj = new Map<number, number[]>();

  for (const step of steps) {
    inDegree.set(step.id, 0);
    adj.set(step.id, []);
  }
  for (const edge of edges) {
    adj.get(edge.sourceStepId)!.push(edge.targetStepId);
    inDegree.set(edge.targetStepId, (inDegree.get(edge.targetStepId) || 0) + 1);
  }

  const queue: number[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  const result: number[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    for (const neighbor of adj.get(node)!) {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) queue.push(neighbor);
    }
  }

  if (result.length !== steps.length) {
    throw new Error("Workflow has a cycle or disconnected steps.");
  }

  return result;
}
