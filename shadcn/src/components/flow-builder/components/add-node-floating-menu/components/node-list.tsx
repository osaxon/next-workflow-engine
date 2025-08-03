import { BuilderNodeType } from "../../blocks/types";
import { AVAILABLE_NODES, NODES_METADATA } from "../../blocks";
import { Icon } from "@iconify/react";

type NodeListProps = Readonly<{
  nodes: Array<
    (typeof AVAILABLE_NODES)[number] & {
      __meta: (typeof NODES_METADATA)[BuilderNodeType];
      __enabled: boolean;
    }
  >;
  onNodeAdd: (type: BuilderNodeType) => void;
}>;

export default function NodeList({ nodes, onNodeAdd }: NodeListProps) {
  return (
    <div className="flex flex-col gap-y-0.5 p-1">
      {nodes.map((node) => (
        <button
          onClick={() => {
            onNodeAdd(node.type);
          }}
          type="button"
          disabled={!node.__enabled}
          key={node.type}
          className="flex items-center rounded-xl bg-transparent p-1 transition disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-20 active:bg-card-foreground/10 hover:bg-card-foreground/10"
        >
          <div className="size-7 flex shrink-0 items-center justify-center border border-card-foreground/10 rounded-lg bg-card">
            <Icon icon={node.icon} className={"size-4 text-card-foreground"} />
          </div>

          <div className="ml-2 text-sm text-card-foreground/80">
            {node.title}
          </div>
        </button>
      ))}
    </div>
  );
}
