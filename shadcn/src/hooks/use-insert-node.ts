import { BuilderNodeType } from "@/components/flow-builder/components/blocks/types";
import { createNodeWithDefaultData } from "@/components/flow-builder/components/blocks/utils";
import { type XYPosition, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

export function useInsertNode() {
  const { addNodes, screenToFlowPosition, getNodes, updateNode } =
    useReactFlow();

  return useCallback(
    (type: BuilderNodeType, pos?: XYPosition) => {
      const _pos =
        pos ||
        screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });

      getNodes().forEach((node) => {
        if (node.selected) {
          updateNode(node.id, { selected: false });
        }
      });

      const newNode = createNodeWithDefaultData(type, {
        position: _pos,
        selected: true,
      });
      addNodes(newNode);

      return newNode;
    },
    [screenToFlowPosition, getNodes, addNodes, updateNode]
  );
}
