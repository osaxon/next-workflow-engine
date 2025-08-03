import { useReactFlow } from "@xyflow/react";
import { type DragEvent, useCallback } from "react";
import { useInsertNode } from "./use-insert-node";
import { NODE_TYPE_DRAG_DATA_FORMAT } from "@/contants/symbols";
import { BuilderNode } from "@/components/flow-builder/components/blocks/types";

export function useDragDropFlowBuilder() {
  const { screenToFlowPosition } = useReactFlow();
  const insertNode = useInsertNode();

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();

      const type = e.dataTransfer.getData(NODE_TYPE_DRAG_DATA_FORMAT);
      if (typeof type === "undefined" || !type) return;

      insertNode(
        type as BuilderNode,
        screenToFlowPosition({
          x: e.clientX,
          y: e.clientY,
        })
      );
    },
    [insertNode, screenToFlowPosition]
  );

  return [onDragOver, onDrop];
}
