import type z from "zod";
import type { startActionConfigSchema } from "./schemas";

export type StartStepConfig = z.infer<typeof startActionConfigSchema>;
