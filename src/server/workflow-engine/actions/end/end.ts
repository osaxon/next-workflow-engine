import { z } from "zod";
import type { TWorkflowStep } from "../../workflow-step/types";
import { WorkflowStep } from "../../workflow-step/workflow-step";
import { type IWorkflowAction, type StepResult } from "../types";
import { endActionConfigSchema } from "./schemas";
import type { EndStepConfig } from "./types";

export class EndAction implements IWorkflowAction<EndStepConfig> {
  name = "end";
  schema = endActionConfigSchema;
  workflowStep: WorkflowStep<EndStepConfig>;

  constructor(step: TWorkflowStep) {
    const parsed = this.schema.safeParse(step.config);

    if (!parsed.success) {
      console.error(z.prettifyError(parsed.error));
    }

    this.workflowStep = new WorkflowStep(step);
  }

  async Execute(): Promise<StepResult<EndStepConfig>> {
    return {
      result: "COMPLETE",
      inputData: this.workflowStep.getConfig(),
    };
  }
}
