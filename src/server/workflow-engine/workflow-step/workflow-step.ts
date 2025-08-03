import type { Config, TWorkflowStep } from "./types";

export interface IWorkflowStep {
  workflowStep: TWorkflowStep;
  getConfig: () => Config;
}

export class WorkflowStep<TConfig extends Config> implements IWorkflowStep {
  workflowStep: TWorkflowStep;

  constructor(workflowStep: TWorkflowStep) {
    this.workflowStep = workflowStep;
  }

  getConfig() {
    return this.workflowStep.config as TConfig;
  }

  // getConfigValue<
  //   K extends TConfig[number]["name"],
  //   T extends TConfig[number]["type"],
  // >(key: K) {
  //   const val = this.workflowStep.config.find((param) => param.name === key);

  //   const type = val?.type;

  //   if (!val) {
  //     throw new Error(`Input value '${key}' of type '${type}' not found.`);
  //   }

  //   return val.value as Extract<TConfig[number], { name: K; type: T }>["value"];
  // }
}
