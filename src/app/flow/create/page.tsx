"use client";
import { FlowBuilderPage } from "~/app/_components/flow-builder";
import { useFlowStore } from "~/stores/flow-store";

export default function CreateWorkflow() {
  const initWorkflow = useFlowStore((s) => s.actions.initialiseWorkflow);

  return <FlowBuilderPage workflow={initWorkflow()} />;
}
