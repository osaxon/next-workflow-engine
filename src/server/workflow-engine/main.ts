import { eq, type InferSelectModel } from "drizzle-orm";
import { db } from "../db";
import {
  workflowInstances,
  workflowStepInstances,
  type WorkflowStepInstance,
} from "../db/schema";
import { ActionFactory, type WorkflowActions } from "./actions/action-factory";
import {
  getWorkflowByIdWithEdgesAndSteps,
  type WorkflowWithEdgesAndSteps,
} from "~/services/get-workflow";

type WorkflowResult = {
  status: "SUCCESS" | "FAILED" | "RUNNING";
};

type StepOutputs = Record<number, unknown>;

type StepMap = Map<number, WorkflowWithEdgesAndSteps["steps"][number]>;

interface IWorkflowEngine {
  Run(workflowId: number): Promise<WorkflowResult>;
}

export class WorkflowEngine implements IWorkflowEngine {
  async Run(workflowId: number) {
    console.log("RUNNING WORKFLOW");
    const workflowResult: WorkflowResult = {
      status: "RUNNING",
    };

    let workflowInstance;
    try {
      const workflow = await getWorkflowByIdWithEdgesAndSteps(workflowId);

      workflowInstance = await this.createWorkflowInstance(workflowId);

      const stepMap = this.createStepMap(workflow.steps);
      const executionOrder = topologicalSort(workflow.steps, workflow.edges);

      const stepOutputs: StepOutputs = {};

      for (const stepId of executionOrder) {
        await this.executeStep(
          stepId,
          stepMap,
          workflowInstance.id,
          stepOutputs
        );
      }
      await db
        .update(workflowInstances)
        .set({
          status: "COMPLETE",
          error: null,
        })
        .where(eq(workflowInstances.id, workflowInstance.id));

      workflowResult.status = "SUCCESS";
    } catch (error) {
      // if the workflow instance was already created then set to failed
      if (workflowInstance?.id) {
        await db
          .update(workflowInstances)
          .set({
            status: "FAILED",
            error: JSON.stringify({ error }),
          })
          .where(eq(workflowInstances.id, workflowInstance.id));
      }
      workflowResult.status = "FAILED";
    }

    return workflowResult;
  }

  private createStepMap(steps: WorkflowWithEdgesAndSteps["steps"]) {
    return new Map(steps.map((step) => [step.id, step]));
  }

  private async createWorkflowInstance(workflowId: number) {
    const [workflowInstance] = await db
      .insert(workflowInstances)
      .values({
        workflowId,
        status: "STARTED",
        startedAt: new Date(),
      })
      .returning({ id: workflowInstances.id });

    if (!workflowInstance)
      throw new Error("Could not create workflow instance");

    return workflowInstance;
  }

  private async executeStep(
    stepId: number,
    stepMap: StepMap,
    workflowInstanceId: number,
    stepOutputs: StepOutputs
  ) {
    const step = stepMap.get(stepId);
    if (!step) throw new Error(`Step ${stepId} not found`);

    const actionDef = await db.query.workflowActions.findFirst({
      where: (workflowActions, { eq }) =>
        eq(workflowActions.name, step.action.name),
    });

    if (!actionDef) throw new Error("couldn't find action in db");

    const workflowStepInstanceData: WorkflowStepInstance = {
      inputValues: JSON.stringify(step.config),
      workflowInstanceId: workflowInstanceId,
      workflowActionId: actionDef?.id,
      status: "STARTED",
      startedAt: new Date(),
    };

    const [stepInstance] = await db
      .insert(workflowStepInstances)
      .values(workflowStepInstanceData)
      .returning({ stepInstanceId: workflowStepInstances.id });

    if (!stepInstance) {
      throw new Error("Error creating step instance");
    }

    const action = ActionFactory.InitAction(
      step.action.name as WorkflowActions,
      step
    );

    if (!action) {
      throw new Error("Error initialising action");
    }

    const output = await action.Execute();

    await db
      .update(workflowStepInstances)
      .set({
        status: output?.result,
        error: output?.error ?? null,
        finishedAt: new Date(),
      })
      .where(eq(workflowStepInstances.id, stepInstance.stepInstanceId));
    stepOutputs[stepId] = output;
  }
}

function topologicalSort(
  steps: WorkflowWithEdgesAndSteps["steps"],
  edges: WorkflowWithEdgesAndSteps["edges"]
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
