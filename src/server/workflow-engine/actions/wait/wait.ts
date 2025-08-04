import { setTimeout } from "node:timers/promises";
import { z } from "zod";
import type { TWorkflowStep } from "../../workflow-step/types";
import { WorkflowStep } from "../../workflow-step/workflow-step";
import type { IWorkflowAction, StepResult } from "../types";
import { waitStepConfig } from "./schemas";
import type { WaitStepConfig } from "./types";

export class WaitAction implements IWorkflowAction<WaitStepConfig> {
  schema = waitStepConfig;
  name = "wait";
  duration: number;
  workflowStep: WorkflowStep<WaitStepConfig>;

  constructor(step: TWorkflowStep) {
    const parsed = this.schema.safeParse(step.config);

    if (!parsed.success) {
      console.error(z.prettifyError(parsed.error));
    }

    this.workflowStep = new WorkflowStep(step);
    const waitConfig = this.workflowStep.getConfig();

    this.duration = waitConfig.duration;
  }

  async Execute(): Promise<StepResult<WaitStepConfig>> {
    try {
      await setTimeout(this.duration);

      return {
        result: "COMPLETE",
        inputData: this.workflowStep.getConfig(),
      };
    } catch (error) {
      return {
        result: "FAILED",
        error: JSON.stringify(error),
        inputData: this.workflowStep.getConfig(),
      };
    }
  }
}
