import type { TWorkflowStep } from "../../workflow-step/types";
import { WorkflowStep } from "../../workflow-step/workflow-step";
import { type IWorkflowAction, type StepResult } from "../types";
import { startActionConfigSchema } from "./schemas";
import type { StartStepConfig } from "./types";

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

  async Execute(): Promise<StepResult<StartStepConfig>> {
    return {
      result: "COMPLETE",
      inputData: this.workflowStep.getConfig(),
    };
  }
}
