"use client";
import { ReactFlowProvider } from "@xyflow/react";
import { useEffect } from "react";
import { SidebarModule } from "~/components/flow-builder/components/blocks/sidebar/sidebar-module";
import { FlowBuilder } from "~/components/flow-builder/flow-builder";
import type { WorkflowSchema } from "~/services/get-workflow";
import { useFlowStore } from "~/stores/flow-store";

export const FlowBuilderPage = ({ workflow }: { workflow: WorkflowSchema }) => {
  // 1. gets an action from zustand which sets the workflow data to the store
  const setWorkflow = useFlowStore((s) => s.actions.setWorkflow);

  // 2. sets the workflow to zustand store
  useEffect(() => {
    setWorkflow(workflow);
  }, [setWorkflow, workflow]);

  return (
    <ReactFlowProvider>
      <div className="flex flex-col  h-dvh">
        <div className="flex grow divide-x divide-card-foreground/10">
          <div className="grow bg-card md:bg-transparent">
            <FlowBuilder />
          </div>
          <SidebarModule />
        </div>
      </div>
    </ReactFlowProvider>
  );
};
