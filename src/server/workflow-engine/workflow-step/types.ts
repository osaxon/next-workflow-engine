import type z from "zod";
import type { workflowStepSchema } from "./schemas";

export type TWorkflowStep = z.infer<typeof workflowStepSchema>;
export type Config = TWorkflowStep["config"];
