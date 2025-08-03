import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { workflowSteps } from "~/server/db/schema";

export const workflowStepConfigSchema = z.record(z.string(), z.any());

export const workflowStepSchema = createInsertSchema(workflowSteps, {
  config: workflowStepConfigSchema,
});
