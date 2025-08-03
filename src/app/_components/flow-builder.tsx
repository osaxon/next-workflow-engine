"use client";
import { ReactFlowProvider } from "@xyflow/react";
import { useEffect } from "react";
import { SidebarModule } from "~/components/flow-builder/components/blocks/sidebar/sidebar-module";
import { FlowBuilder } from "~/components/flow-builder/flow-builder";
import { useFlowStore, type IFlowState } from "~/stores/flow-store";
import { workflowSchema } from '../../stores/flow-store';
import type { WorkflowSchema } from "~/services/get-workflow";

export const FlowBuilderPage = ({
  workflow,
}: {
  workflow: WorkflowSchema;
}) => {
  const setWorkflow = useFlowStore((s) => s.actions.setWorkflow);

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
