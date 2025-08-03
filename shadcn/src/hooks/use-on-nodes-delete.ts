"use client";

import { useCallback } from "react";
import type { Node } from "@xyflow/react";
import { useFlowStore } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";

export function useOnNodesDelete(nodes: Node[]) {
  const [nodePropertiesSelectedNode, nodePropertiesSetSelectedNode] =
    useFlowStore(
      useShallow((state) => [
        state.workflow.sidebar.panels.nodeProperties.selectedNode,
        state.actions.sidebar.panels.nodeProperties.setSelectedNode,
      ])
    );

  return useCallback(
    (_: Node[]) => {
      if (
        nodePropertiesSelectedNode &&
        !nodes.find((node) => node.id === nodePropertiesSelectedNode.id)
      )
        nodePropertiesSetSelectedNode(null);
    },
    [nodePropertiesSelectedNode, nodePropertiesSetSelectedNode, nodes]
  );
}
