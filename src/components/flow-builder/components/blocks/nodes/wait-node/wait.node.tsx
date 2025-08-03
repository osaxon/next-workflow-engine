import { Position, type Node, type NodeProps } from "@xyflow/react";
import { nanoid } from "nanoid";
import { memo, useCallback, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import {
  BuilderNode,
  type BaseNodeData,
  type RegisterNodeMetadata,
} from "~/flow-builder/blocks/types";
import {
  NodeCard,
  NodeCardContent,
  NodeCardDescription,
  NodeCardHeader,
} from "~/flow-builder/ui/node-card";
import { useDeleteNode } from "~/hooks/use-delete-node";
import { useFlowStore } from "~/stores/flow-store";
import CustomHandle from "../../../handles/custom-handler";
import { getNodeDetail } from "../../utils";

const NODE_TYPE = BuilderNode.WAIT;

export interface WaitNodeData extends BaseNodeData {
  duration: number;
}

type WaitNodeProps = NodeProps<Node<WaitNodeData, typeof NODE_TYPE>>;

export function WaitNode({ id, isConnectable, selected, data }: WaitNodeProps) {
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
    <NodeCard>
      <NodeCardHeader
        icon={meta.icon}
        title={meta.title}
        handleDeleteNode={handleDeleteNode}
        handleShowNodeProperties={handleShowNodeProperties}
      />
      <NodeCardContent>
        <div className="flex flex-col p-4">
          <p>Wait</p>
        </div>
        <NodeCardDescription description="This will pause the workflow for the provided number of ms." />
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

export const metadata: RegisterNodeMetadata<WaitNodeData> = {
  type: NODE_TYPE,
  node: memo(WaitNode),
  detail: {
    icon: "",
    title: "Wait",
    description: "Wait for a duration of ms.",
  },
  connection: {
    inputs: 1,
    outputs: 1,
  },
  defaultData: {
    duration: 500,
  },
  serverActionId: 1,
};
