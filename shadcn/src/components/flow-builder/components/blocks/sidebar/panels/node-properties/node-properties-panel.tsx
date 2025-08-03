import { useFlowStore } from "@/stores/flow-store";
import { useNodes, useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import { useMemo } from "react";
import { useNodeList } from "./hooks/use-node-list";
import SidebarPanelWrapper from "../../components/sidebar-panel-wrapper";
import { BuilderNode } from "../../../types";
import SidebarPanelHeading from "../../components/sidebar-panel-heading";
import { NodeListItem } from "./components/node-list-item";
import { NodePropertyPanel } from "./components/node-propery-panel";
import IntroductionPropertyPanel from "./property-panels/introduction-property-panel";
import { HeaderWithIcon } from "@/components/flow-builder/components/ui/header-with-icon";

export function NodePropertiesPanel() {
  const selectedNode = useFlowStore(
    (s) => s.workflow.sidebar.panels.nodeProperties.selectedNode
  );

  const setSelectedNode = useFlowStore(
    (s) => s.actions.sidebar.panels.nodeProperties.setSelectedNode
  );

  const nodes = useNodes();

  const nodeList = useNodeList(nodes);

  const { setNodes } = useReactFlow();

  const onNodeClick = (id: string) => {
    setNodes((nds) =>
      produce(nds, (draft) => {
        draft.forEach((node) => {
          node.selected = node.id === id;
        });
      })
    );

    setSelectedNode({
      id,
      type: nodeList.find((n) => n.id === id)?.type as BuilderNode,
    });
  };

  const selectedNodeData = useMemo(() => {
    return nodes.find((n) => n.id === selectedNode?.id)?.data;
  }, [nodes, selectedNode?.id]);

  return (
    <SidebarPanelWrapper>
      <div className="h-80 w-80 flex flex-col">
        <SidebarPanelHeading className="shrink-0">
          <HeaderWithIcon icon="mynaui:layers-three" title="Nodes in Flow" />
        </SidebarPanelHeading>

        <div className="flex w-full  flex-col gap-1 p-1.5 overflow-y-auto">
          {nodeList.map((node) => (
            <NodeListItem
              key={node.id}
              id={
                node.type === BuilderNode.START || node.type === BuilderNode.END
                  ? undefined
                  : node.id
              }
              title={node.detail.title}
              icon={node.detail.icon}
              selected={selectedNode?.id === node.id}
              pseudoSelected={node.selected}
              onClick={() => {
                onNodeClick(node.id);
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-80 max-h-[360px] 2xl:max-h-[594px] flex flex-col">
        <SidebarPanelHeading className="shrink-0">
          <HeaderWithIcon icon="mynaui:cog" title="Node Properties" />
        </SidebarPanelHeading>

        <div className="flex w-full  flex-col  overflow-y-auto">
          {selectedNode ? (
            <NodePropertyPanel
              id={selectedNode.id}
              type={selectedNode.type}
              data={selectedNodeData}
            />
          ) : (
            <IntroductionPropertyPanel />
          )}
        </div>
      </div>
    </SidebarPanelWrapper>
  );
}
