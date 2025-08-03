import { type Node, type NodeProps, Position } from "@xyflow/react";
import { nanoid } from "nanoid";
import { memo, useMemo, useState } from "react";
import { BaseNodeData, BuilderNode, RegisterNodeMetadata } from "../types";
import { getNodeDetail } from "../utils";
import CustomHandle from "../../handles/custom-handler";
import { Icon } from "@iconify/react";

export interface StartNodeData extends BaseNodeData {
  label?: string;
}

const NODE_TYPE = BuilderNode.START;

export type StartNodeProps = NodeProps<Node<StartNodeData, typeof NODE_TYPE>>;

export function StartNode({ data, selected, isConnectable }: StartNodeProps) {
  const meta = useMemo(() => getNodeDetail(NODE_TYPE), []);

  const [sourceHandleId] = useState<string>(nanoid());

  return (
    <div
      data-selected={selected}
      className="flex items-center text-foreground border border-card-foreground/10 rounded-full bg-card px-4 py-2 shadow-sm transition data-[selected=true]:border-primary"
    >
      <Icon icon={meta.icon} className={"size-4 shrink-0 mr-2 scale-130"} />

      <span className="mr-1">{data.label || meta.title}</span>
      <CustomHandle
        type="source"
        id={sourceHandleId}
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export const metadata: RegisterNodeMetadata<StartNodeData> = {
  type: NODE_TYPE,
  node: memo(StartNode),
  detail: {
    icon: "solar:play-bold",
    title: "Start",
    description: "Start the chatbot flow",
  },
  connection: {
    inputs: 0,
    outputs: 1,
  },
  available: false,
  defaultData: {
    label: "Start",
    deletable: false,
  },
};
