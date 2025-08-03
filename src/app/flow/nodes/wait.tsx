import {
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
} from "@xyflow/react";
import { useCallback } from "react";

import {
  BaseNode,
  BaseNodeContent,
  BaseNodeFooter,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "~/components/base-node";
import { LabeledHandle } from "~/components/labeled-handle";

import { EllipsisVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export type NumNode = Node<{
  value: number;
}>;

export function WaitNode({ id, data }: NodeProps<NumNode>) {
  const { updateNodeData, setNodes } = useReactFlow();

  const handleReset = useCallback(() => {
    updateNodeData(id, { value: 500 });
  }, [id, updateNodeData]);

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleIncr = useCallback(() => {
    updateNodeData(id, { value: data.value + 1 });
  }, [id, data.value, updateNodeData]);

  const handleDecr = useCallback(() => {
    updateNodeData(id, { value: data.value - 1 });
  }, [id, data.value, updateNodeData]);

  return (
    <BaseNode>
      <BaseNodeHeader className="border-b">
        <BaseNodeHeaderTitle>Wait</BaseNodeHeaderTitle>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="nodrag p-1"
              aria-label="Node Actions"
              title="Node Actions"
            >
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Node Actions</DropdownMenuLabel>
            <DropdownMenuItem onSelect={handleReset}>Reset</DropdownMenuItem>
            <DropdownMenuItem onSelect={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </BaseNodeHeader>

      <BaseNodeContent>
        <div className="flex gap-2 items-center">
          <Button size="icon" onClick={handleDecr}>
            -
          </Button>
          <pre>{String(data.value).padStart(3, " ")}</pre>
          <pre>ms</pre>
          <Button size="icon" onClick={handleIncr}>
            +
          </Button>
        </div>
      </BaseNodeContent>

      <BaseNodeFooter className="bg-gray-100 items-end px-0 py-1 w-full">
        <LabeledHandle title="out" type="source" position={Position.Right} />
      </BaseNodeFooter>
    </BaseNode>
  );
}
