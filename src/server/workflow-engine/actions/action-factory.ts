import type { TWorkflowStep } from "../workflow-step/types";
import { EndAction } from "./end/end";
import { StartAction } from "./start/start";
import type { IWorkflowAction } from "./types";
import { WaitAction } from "./wait/wait";

export type WorkflowActions = "wait" | "start" | "end";

const actionRegistry: Record<
  WorkflowActions,
  new (config: TWorkflowStep) => IWorkflowAction<any>
> = {
  wait: WaitAction,
  start: StartAction,
  end: EndAction,
};

export class ActionFactory {
  static InitAction(
    action: WorkflowActions,
    config: TWorkflowStep
  ): IWorkflowAction<TWorkflowStep["config"]> | null {
    const ActionClass = actionRegistry[action];
    if (!ActionClass) {
      throw new Error(`Unknown action: ${action}`);
    }
    return new ActionClass(config);
  }
}
