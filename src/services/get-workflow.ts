import z from "zod";
import { workflowSchema } from "~/stores/flow-store";

export type WorkflowSchema = z.infer<typeof workflowSchema>;

export const getWorkflow = async (id: string): Promise<WorkflowSchema> => {
  const workflow = await import("../../data/workflow.json").then(
    (data) => data.default
  );
  const parsed = workflowSchema.safeParse(workflow);

  if (!parsed.success) {
    console.error(z.prettifyError(parsed.error));
    throw new Error(z.prettifyError(parsed.error));
  }

  return parsed.data;
};
