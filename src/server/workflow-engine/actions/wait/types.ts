import type z from "zod";
import type { waitStepConfig } from "./schemas";

export type WaitStepConfig = z.infer<typeof waitStepConfig>;
