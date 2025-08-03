import { setTimeout } from "node:timers/promises";
import { z } from "zod";
import type { TWorkflowStep } from "../../workflow-step/types";
import { WorkflowStep } from "../../workflow-step/workflow-step";
import type { IWorkflowAction } from "../types";
import { waitActionSchema } from "./schemas";
import type { WaitActionStep } from "./types";
import { db } from "~/server/db";
import {
  workflowStepInstances,
  type WorkflowStepInstance,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";

export class WaitAction implements IWorkflowAction<WaitActionStep["config"]> {
  schema = waitActionSchema;
  duration: number;
  workflowStep: WorkflowStep<WaitActionStep["config"]>;

  constructor(config: TWorkflowStep) {
    const parsed = this.schema.safeParse(config);

    if (!parsed.success) {
      console.error(z.prettifyError(parsed.error));
    }

    this.workflowStep = new WorkflowStep(config);
    const waitConfig = this.workflowStep.getConfig();

    this.duration = waitConfig.duration;
  }

  async execute() {
    const workflowStepInstanceData: WorkflowStepInstance = {
      inputValues: JSON.stringify({ duration: this.duration }),
      workflowInstanceId: 1,
      workflowActionId: 1,
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

    await setTimeout(this.duration);

    await db
      .update(workflowStepInstances)
      .set({ status: "COMPLETE", finishedAt: new Date() })
      .where(eq(workflowStepInstances.id, stepInstance?.stepInstanceId));
  }
}
