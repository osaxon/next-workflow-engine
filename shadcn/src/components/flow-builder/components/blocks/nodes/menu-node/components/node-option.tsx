import CustomHandle from "@/components/flow-builder/components/handles/custom-handler";
import { Input } from "@/components/ui/input";
import { Position } from "@xyflow/react";

type NodeOptionProps = Readonly<{
  id: string;
  option: { id: number; value: string };
  isConnectable: boolean;
}>;

export function NodeOption({ id, isConnectable, option }: NodeOptionProps) {
  return (
    <div className="relative flex items-center gap-x-2 px-4 -mx-4">
      <div className="flex shrink-0 items-center text-xs gap-x-0.5">
        {option.id + 1} -{" "}
      </div>

      <Input
        type="text"
        value={option.value}
        readOnly
        className=" h-8 my-1 !border-none !focus:border-none !focus:ring-0 !ring-0 "
      />

      <CustomHandle
        type="source"
        id={id}
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
}
