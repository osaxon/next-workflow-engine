import { type Node, type NodeProps, Position } from "@xyflow/react";
import { nanoid } from "nanoid";
import { memo, useMemo, useState } from "react";
import { BaseNodeData, BuilderNode, RegisterNodeMetadata } from "../types";
import { getNodeDetail } from "../utils";
import CustomHandle from "../../handles/custom-handler";
import { Icon } from "@iconify/react";

export interface EndNodeData extends BaseNodeData {
  label?: string;
}

const NODE_TYPE = BuilderNode.END;

type EndNodeProps = NodeProps<Node<EndNodeData, typeof NODE_TYPE>>;

export function EndNode({ data, selected, isConnectable }: EndNodeProps) {
  const meta = useMemo(() => getNodeDetail(NODE_TYPE), []);

  const [sourceHandleId] = useState<string>(nanoid());

  return (
    <div
      data-selected={selected}
      data-deletable={false}
      className="flex items-center text-foreground border border-card-foreground/10 rounded-full bg-card px-4 py-2 shadow-sm transition data-[selected=true]:border-primary"
    >
      <Icon icon={meta.icon} className={"size-4 shrink-0 mr-2 scale-130"} />

      <span className="mr-1">{data.label || meta.title}</span>
      <CustomHandle
        type="target"
        id={sourceHandleId}
        position={Position.Left}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export const metadata: RegisterNodeMetadata<EndNodeData> = {
  type: NODE_TYPE,
  node: memo(EndNode),
  detail: {
    icon: "solar:stop-bold",
    title: "End",
    description: "End the chatbot flow",
  },
  connection: {
    inputs: 1,
    outputs: 0,
  },
  available: false,
  defaultData: {
    label: "End",
    deletable: true,
  },
};
