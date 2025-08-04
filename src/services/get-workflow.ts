"use server";

import z from "zod";
import { db } from "~/server/db";
import {
  workflowFullQuery,
  workflowInstancesQuery,
} from "~/server/db/prepared-statements";
import { workflowSchema } from "~/stores/flow-store";

export type WorkflowSchema = z.infer<typeof workflowSchema>;

export const getWorkflowForClient = async (
  id: number
): Promise<WorkflowSchema | null> => {
  const workflow = await getWorkflowByIdWithEdgesAndSteps(id);

  const reactFlow = mapWorkflowToReactFlow(workflow);

  return reactFlow;
};

function mapWorkflowToReactFlow(workflow: WorkflowWithEdgesAndSteps) {
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

export async function getWorkflowByIdWithEdgesAndSteps(id: number) {
  const workflow = await workflowFullQuery.execute({ id });

  if (!workflow) {
    throw new Error("error fetching workflow");
  }
  return workflow;
}

export async function getWorkflowInstances(id: number) {
  const instances = await workflowInstancesQuery.execute({
    id,
  });

  return instances;
}

export type WorkflowWithEdgesAndSteps = Awaited<
  Promise<ReturnType<typeof getWorkflowByIdWithEdgesAndSteps>>
>;

export type WorkflowInstances = Awaited<
  Promise<ReturnType<typeof getWorkflowInstances>>
>;
