import { z } from "zod";

export const endActionConfigSchema = z.object({
  label: z.literal("End"),
  deletable: z.boolean(),
});
