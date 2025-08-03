"use client"
import { SidebarModule } from "@/components/flow-builder/components/blocks/sidebar/sidebar-module"
import { FlowBuilder } from "@/components/flow-builder/flow-builder"
import { useFlowStore, type IFlowState } from "@/stores/flow-store"
import { ReactFlowProvider } from "@xyflow/react"
import { useEffect } from "react"

export const FlowBuilderPage = ({ workflow }: { workflow: IFlowState["workflow"] }) => {
  const setWorkflow = useFlowStore((s) => s.actions.setWorkflow)

  useEffect(() => {
    setWorkflow(workflow)
  }, [setWorkflow, workflow])

  return <ReactFlowProvider>
  <div className="flex flex-col  h-dvh">
    <div className="flex grow divide-x divide-card-foreground/10">
      <div className="grow bg-card md:bg-transparent">
        <FlowBuilder />
      </div>
      <SidebarModule />
    </div>
  </div>
</ReactFlowProvider>
}