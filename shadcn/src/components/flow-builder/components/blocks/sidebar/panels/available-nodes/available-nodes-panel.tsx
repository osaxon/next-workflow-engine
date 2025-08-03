import { useInsertNode } from "@/hooks/use-insert-node";
import { useFlowStore } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";
import SidebarPanelWrapper from "../../components/sidebar-panel-wrapper";
import { AVAILABLE_NODES } from "../../..";
import { NodePreviewDraggable } from "./components/node-preview-draggable";
import { Icon } from "@iconify/react";

export default function AvailableNodesPanel() {
  const [setActivePanel] = useFlowStore(
    useShallow((s) => [ s.actions.sidebar.setActivePanel])
  );

  const insertNode = useInsertNode();

  return (
    <SidebarPanelWrapper>
      <div className="mt-4 flex  flex-col items-center p-4 text-center ">
        <div className="size-12 flex items-center justify-center rounded-full bg-primary">
          <Icon icon="mynaui:grid" className="size-6 text-white" />
        </div>

        <div className="mt-4 text-balance font-medium">Available Nodes</div>

        <div className="mt-1 w-2/3 text-xs text-light-50/40 font-medium leading-normal">
          Drag and drop nodes to build your chatbot flow
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4">
        {AVAILABLE_NODES.map((node) => (
          <NodePreviewDraggable
            key={node.type}
            type={node.type}
            icon={node.icon}
            title={node.title}
            description={node.description}
            setActivePanel={setActivePanel}
            insertNode={insertNode}
          />
        ))}
      </div>
    </SidebarPanelWrapper>
  );
}
