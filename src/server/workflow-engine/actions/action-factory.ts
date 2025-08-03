import type { TWorkflowStep } from "../workflow-step/types";
import type { IWorkflowAction } from "./types";
import { WaitAction } from "./wait/wait";

export type WorkflowActions = "wait";

const actionRegistry: Record<
	WorkflowActions,
	new (
		config: TWorkflowStep,
	) => IWorkflowAction<any>
> = {
	wait: WaitAction,
};

export class ActionFactory {
	static InitAction(
		action: WorkflowActions,
		config: TWorkflowStep,
	): IWorkflowAction<TWorkflowStep["config"]> | null {
		const ActionClass = actionRegistry[action];
		if (!ActionClass) {
			throw new Error(`Unknown action: ${action}`);
		}
		return new ActionClass(config);
	}
}
