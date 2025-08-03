import { type Node, type NodeProps, Position } from "@xyflow/react";
import { nanoid } from "nanoid";
import { memo, useCallback, useMemo, useState } from "react";
import { BaseNodeData, BuilderNode, RegisterNodeMetadata } from "../../types";
import { getNodeDetail } from "../../utils";
import { useDeleteNode } from "@/hooks/use-delete-node";
import CustomHandle from "../../../handles/custom-handler";
import { NodeOption } from "./components/node-option";

import {
  NodeCard,
  NodeCardContent,
  NodeCardDescription,
  NodeCardFooter,
  NodeCardHeader,
} from "@flow-builder-ui/node-card";
import { useFlowStore } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";
import { isEmpty } from "lodash";
import MenuNodePropertyPanel from "../../sidebar/panels/node-properties/property-panels/menu-property-panel";

const NODE_TYPE = BuilderNode.MENU;

export interface MenuNodeData extends BaseNodeData {
  question: string | null;
  options: { id: string; option: { id: number; value: string } }[];
}

type MenuNodeProps = NodeProps<Node<MenuNodeData, typeof NODE_TYPE>>;

export function MenuNode({ id, isConnectable, selected, data }: MenuNodeProps) {
  const meta = useMemo(() => getNodeDetail(NODE_TYPE), []);

  const [showNodePropertiesOf] = useFlowStore(
    useShallow((s) => [s.actions.sidebar.showNodePropertiesOf])
  );
  const [sourceHandleId] = useState<string>(nanoid());

  const deleteNode = useDeleteNode();

  const handleDeleteNode = () => {
    deleteNode(id);
  };

  const handleShowNodeProperties = useCallback(() => {
    showNodePropertiesOf({ id, type: NODE_TYPE });
  }, [id, showNodePropertiesOf]);

  return (
    <NodeCard data-selected={selected} onDoubleClick={handleShowNodeProperties}>
      <NodeCardHeader
        icon={meta.icon}
        title={meta.title}
        handleDeleteNode={handleDeleteNode}
        handleShowNodeProperties={handleShowNodeProperties}
        gradientColor={meta.gradientColor}
      />

      <NodeCardContent>
        <div className=" min-h-10 flex flex-col">
          <div className="flex flex-col p-4">
            <div className="text-xs font-medium text-card-foreground">
              Question
            </div>

            <div className="line-clamp-4 mt-2 text-sm leading-snug">
              <span className="text-card-foreground italic">
                {isEmpty(data.question) ? "No question..." : data.question}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-4 z-50">
          <div className="text-xs text-light-900/50 font-medium">Options</div>

          {data.options.length > 0 &&
            Array.from(data.options)
              .sort((a, b) => a.option.id - b.option.id)
              .map((option) => (
                <NodeOption
                  key={option.id}
                  id={option.id}
                  option={option.option}
                  isConnectable={isConnectable}
                />
              ))}
        </div>

        <NodeCardDescription description="Options to choose from." />
        <NodeCardFooter nodeId={id} />
      </NodeCardContent>
      <CustomHandle
        type="target"
        id={sourceHandleId}
        position={Position.Left}
        isConnectable={isConnectable}
      />
    </NodeCard>
  );
}

export const metadata: RegisterNodeMetadata<MenuNodeData> = {
  type: NODE_TYPE,
  node: memo(MenuNode),
  detail: {
    icon: "f7:menu",
    title: "Menu",
    description:
      "Send options to the user choosing one of them based on the condition.",
    gradientColor: "fuchsia",
  },
  connection: {
    inputs: 1,
    outputs: 0,
  },
  defaultData: {
    question: null,
    options: [
      {
        id: nanoid(),
        option: {
          id: 0,
          value: "Option 1",
        },
      },
      {
        id: nanoid(),
        option: {
          id: 1,
          value: "Option 2",
        },
      },
      {
        id: nanoid(),
        option: {
          id: 2,
          value: "Option 3",
        },
      },
    ],
  },
  propertyPanel: MenuNodePropertyPanel,
};
