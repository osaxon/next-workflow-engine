import { useCallback, useMemo } from "react";
import { useAddNodeOnEdgeDropStore } from "@/stores/add-node-on-edge-drop-state";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NodeList from "./components/node-list";
import { useShallow } from "zustand/shallow";
import { BuilderNode, BuilderNodeType } from "../blocks/types";
import { AVAILABLE_NODES, NODES_METADATA } from "../blocks";

type AddNodeFloatingMenuProps = Readonly<{
  onNodeAdd: (type: BuilderNodeType) => void;
}>;

export default function AddNodeFloatingMenu({
  onNodeAdd,
}: AddNodeFloatingMenuProps) {
  const [showMenu, setShowMenu, anchorPosition, _incomingNodeMetadetails] =
    useAddNodeOnEdgeDropStore(
      useShallow((s) => [
        s.showMenu,
        s.actions.setShowMenu,
        s.anchorPosition,
        s.incomingNodeMetadetails,
      ])
    );

  const onOutsideClick = useCallback(() => {
    setShowMenu(false);
  }, [setShowMenu]);

  const handleOnNodeAdd = useCallback(
    (type: BuilderNodeType) => {
      setShowMenu(false);
      onNodeAdd(type);
    },
    [onNodeAdd, setShowMenu]
  );

  const incomingNodeMetadetails = useMemo(
    () => _incomingNodeMetadetails,
    [_incomingNodeMetadetails]
  );

  const nodesWithMetadata = useMemo(() => {
    const mapNodesWithMetadata = (
      types: BuilderNodeType[]
    ): Array<
      (typeof AVAILABLE_NODES)[number] & {
        __meta: (typeof NODES_METADATA)[BuilderNodeType];
        __enabled: boolean;
      }
    > =>
      types.map((type) => {
        const meta = NODES_METADATA[type];
        const isFromSource =
          incomingNodeMetadetails?.fromHandle?.type === "source";
        const isFromTarget =
          incomingNodeMetadetails?.fromHandle?.type === "target";

        const enabled =
          (isFromSource && meta.connection.inputs > 0) ||
          (isFromTarget && meta.connection.outputs > 0) ||
          !incomingNodeMetadetails;

        return {
          type,
          title: meta.detail.title,
          icon: meta.detail.icon,
          description: meta.detail.description,
          gradientColor: meta.detail.gradientColor,
          __meta: meta,
          __enabled: enabled,
        };
      });

    return {
      availableNodes: mapNodesWithMetadata(
        AVAILABLE_NODES.map((node) => node.type)
      ),
      additionalNodes: mapNodesWithMetadata([BuilderNode.END]),
    };
  }, [incomingNodeMetadetails]);

  return (
    <Popover open={showMenu}>
      <PopoverTrigger asChild>
        <div
          className="left absolute size-0 bg-card"
          style={{
            left: `${anchorPosition.x}px`,
            top: `${anchorPosition.y}px`,
          }}
        />
      </PopoverTrigger>
      <PopoverContent
        className="isolate p-0 w-fit z-10 transform origin-[var(--radix-popover-content-transform-origin)] data-[state=closed]:animate-out data-[state=closed]:fade-out  data-[state=open]:animate-in animate-duration-200 select-none overflow-clip border border-card-foreground/10 rounded-xl bg-card/40 shadow-2xl shadow-card/30 backdrop-blur-2xl"
        side="bottom"
        align="start"
        tabIndex={-1}
        updatePositionStrategy="always"
        onFocusOutside={() => onOutsideClick()}
        onInteractOutside={() => onOutsideClick()}
        onEscapeKeyDown={() => onOutsideClick()}
      >
        <div tabIndex={-1} className="w-60 flex flex-col outline-none">
          <NodeList
            nodes={nodesWithMetadata.availableNodes}
            onNodeAdd={handleOnNodeAdd}
          />

          <div className="my-0.5 h-px bg-card-foreground/10" />

          <NodeList
            nodes={nodesWithMetadata.additionalNodes}
            onNodeAdd={handleOnNodeAdd}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
