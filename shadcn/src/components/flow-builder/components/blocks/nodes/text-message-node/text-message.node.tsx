import { type Node, type NodeProps, Position } from "@xyflow/react";
import { nanoid } from "nanoid";
import { isEmpty } from "radash";
import { memo, useCallback, useMemo, useState } from "react";
import { BaseNodeData, BuilderNode, RegisterNodeMetadata } from "../../types";

import { getNodeDetail } from "../../utils";
import { useFlowStore } from "@/stores/flow-store";
import { useDeleteNode } from "@/hooks/use-delete-node";
import CustomHandle from "@/components/flow-builder/components/handles/custom-handler";
import TextMessageNodePropertyPanel from "../../sidebar/panels/node-properties/property-panels/text-message-property-panel";
import { useShallow } from "zustand/shallow";
import {
  NodeCard,
  NodeCardContent,
  NodeCardDescription,
  NodeCardFooter,
  NodeCardHeader,
} from "@flow-builder-ui/node-card";

const NODE_TYPE = BuilderNode.TEXT_MESSAGE;

export interface TextMessageNodeData extends BaseNodeData {
  message: string;
}

type TextMessageNodeProps = NodeProps<
  Node<TextMessageNodeData, typeof NODE_TYPE>
>;

export function TextMessageNode({
  id,
  isConnectable,
  selected,
  data,
}: TextMessageNodeProps) {
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
        <div className="flex flex-col p-4">
          <div className="text-xs font-medium text-card-foreground">
            Message Content
          </div>

          <div className="line-clamp-4 mt-2 text-sm leading-snug">
            {isEmpty(data.message) ? (
              <span className="text-card-foreground italic">
                No message yet...
              </span>
            ) : (
              data.message
            )}
          </div>
        </div>

        <NodeCardDescription description="This message will be sent to user" />

        <NodeCardFooter nodeId={id} />
      </NodeCardContent>
      <CustomHandle
        type="target"
        id={sourceHandleId}
        position={Position.Left}
        isConnectable={isConnectable}
      />

      <CustomHandle
        type="source"
        id={sourceHandleId}
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </NodeCard>
  );
}

export const metadata: RegisterNodeMetadata<TextMessageNodeData> = {
  type: NODE_TYPE,
  node: memo(TextMessageNode),
  detail: {
    icon: "mynaui:message-solid",
    title: "Text Message",
    description:
      "Send a text message to the user using different messaging platforms like WhatsApp, Messenger, etc.",
  },
  connection: {
    inputs: 1,
    outputs: 1,
  },
  defaultData: {
    message: "",
  },
  propertyPanel: TextMessageNodePropertyPanel,
};
