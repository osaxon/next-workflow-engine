import { useFlowStore } from "@/stores/flow-store";
import { getConnectedEdges, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { useShallow } from "zustand/shallow";

export function useDeleteNode() {
  const { getNode, getEdges, deleteElements } = useReactFlow();
  const [deleteNode, deleteEdge] = useFlowStore(
    useShallow((state) => [
      state.actions.nodes.deleteNode,
      state.actions.edges.deleteEdge,
    ])
  );

  return useCallback(
    (id: string) => {
      const node = getNode(id);
      if (!node) return;

      const edges = getEdges();
      const connectedEdges = getConnectedEdges([node], edges);

      deleteElements({ nodes: [node], edges: connectedEdges }).then();
      deleteNode(node);
      for (const edge of connectedEdges) {
        deleteEdge(edge);
      }
    },
    [deleteElements, getEdges, getNode, deleteNode, deleteEdge]
  );
}
