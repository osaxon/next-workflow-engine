import z from "zod";
import type { TWorkflowStep } from "../../workflow-step/types";
import { WorkflowStep } from "../../workflow-step/workflow-step";
import { type IWorkflowAction } from "../types";
import { startActionConfigSchema } from "./schemas";
import type { StartStepConfig } from "./types";
import { db } from "~/server/db";
import {
  workflowStepInstances,
  type WorkflowStepInstance,
} from "~/server/db/schema";

export class StartAction implements IWorkflowAction<StartStepConfig> {
  name = "start";
  schema = startActionConfigSchema;
  workflowStep: WorkflowStep<StartStepConfig>;

  constructor(step: TWorkflowStep) {
    const parsed = startActionConfigSchema.safeParse(step.config);
    if (!parsed.success) {
      console.error("ERROR PARSING");
      throw new Error("unable to parse");
    }
    this.workflowStep = new WorkflowStep(step);
  }

  async Execute(workflowInstanceId: number) {
    const action = await db.query.workflowActions.findFirst({
      where: (workflowActions, { eq }) => eq(workflowActions.name, this.name),
    });

    if (!action) throw new Error("couldn't find action in db");

    const workflowStepInstanceData: WorkflowStepInstance = {
      inputValues: JSON.stringify(this.workflowStep.getConfig()),
      workflowInstanceId: workflowInstanceId,
      workflowActionId: action?.id,
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

    return this.workflowStep.getConfig();
  }
}
