import z from "zod";
import { db } from "~/server/db";
import { workflowSchema } from "~/stores/flow-store";

export type WorkflowSchema = z.infer<typeof workflowSchema>;

export const getWorkflow = async (
  id: number
): Promise<WorkflowSchema | null> => {
  // const dummyworkflow = await import("../../data/workflow.json").then(
  //   (data) => data.default
  // );

  // const parsed = workflowSchema.safeParse(dummyworkflow);

  // if (!parsed.success) {
  //   return null;
  // }

  // return parsed.data;

  const workflow = await getWorkflowByIdWithEdgesAndSteps(id);

  console.log(workflow, "<---- the workflow being passed");

  const reactFlow = mapToReactFlow(workflow);

  return reactFlow;
};

function mapToReactFlow(workflow: WorkflowWithEdgesAndSteps) {
  if (workflow === undefined) return null;

  const edges: {
    source: string;
    target: string;
    id: string;
    type: string;
  }[] = workflow?.edges.map((edge) => ({
    source: edge.sourceStepId.toString(), // TODO fix this
    target: edge.targetStepId.toString(),
    type: "deletable",
    id: edge.id.toString(),
  }));

  const nodes: WorkflowSchema["nodes"] = workflow.steps.map((step) => {
    return {
      id: step.id.toString(),
      type: step.action.name,
      data: step.config,
      position: {
        x: step.positionX,
        y: step.positionY,
      },
      selected: false,
      measured: {
        width: step.width,
        height: step.height,
      },
      dragging: false,
    };
  });

  const workflowSchema: WorkflowSchema = {
    id: workflow?.id.toString(),
    edges,
    name: workflow.name ?? "no name",
    nodes,
    sidebar: {
      active: "available-nodes",
      panels: {
        nodeProperties: {
          selectedNode: null,
        },
      },
    },
  };

  return workflowSchema;
}

async function getWorkflowByIdWithEdgesAndSteps(id: number) {
  return await db.query.workflows.findFirst({
    where: (workflows, { eq }) => eq(workflows.id, id),
    with: {
      edges: {
        with: {
          sourceStep: {
            with: {
              action: true,
            },
          },
          targetStep: {
            with: {
              action: true,
            },
          },
        },
      },
      steps: {
        with: {
          action: true,
        },
      },
    },
  });
}

type WorkflowWithEdgesAndSteps = Awaited<
  Promise<ReturnType<typeof getWorkflowByIdWithEdgesAndSteps>>
>;
