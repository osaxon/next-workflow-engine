import type z from "zod";
import type { endActionConfigSchema } from "./schemas";

export type EndStepConfig = z.infer<typeof endActionConfigSchema>;
