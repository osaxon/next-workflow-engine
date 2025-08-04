import { z } from "zod";

export const startActionConfigSchema = z.object({
  label: z.literal("Start"),
  deletable: z.boolean(),
});
