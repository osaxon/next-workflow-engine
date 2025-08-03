import type { ZodType } from "zod";
import type { Config } from "../workflow-step/types";
import type { WorkflowStep } from "../workflow-step/workflow-step";

export interface IWorkflowAction<TConfig extends Config> {
  schema: ZodType;
  workflowStep: WorkflowStep<TConfig>;
  execute: () => Promise<void>;
}
