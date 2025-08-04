import z from "zod";

export const waitStepConfig = z.object({
  duration: z.number(),
});
