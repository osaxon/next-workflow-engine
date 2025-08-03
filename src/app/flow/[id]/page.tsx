import { FlowBuilderPage } from "~/app/_components/flow-builder";
import { api } from "~/trpc/server";

export default async function Workflow({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workflow = await api.workflow.getWorkflow({
    workflowId: id,
  });

  return <FlowBuilderPage workflow={workflow} />;
}
