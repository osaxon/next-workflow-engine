import { api } from "~/trpc/server";

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const instances = await api.workflow.getWorkflowInstances({
    workflowId: Number(id),
  });

  return <pre>{JSON.stringify(instances, null, 2)}</pre>;
}
