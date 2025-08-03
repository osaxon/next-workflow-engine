import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { workflowSteps } from "~/server/db/schema";

export const waitActionSchema = createSelectSchema(workflowSteps, {
  config: z.record(z.literal("duration"), z.number()),
});
