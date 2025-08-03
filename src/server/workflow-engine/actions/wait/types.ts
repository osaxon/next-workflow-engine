import type z from "zod";
import type { waitActionSchema } from "./schemas";

export type WaitActionStep = z.infer<typeof waitActionSchema>;
