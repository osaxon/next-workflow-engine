import { useMemo } from "react";

import type { Node } from "@xyflow/react";
import { BuilderNode } from "../../../../types";
import { getNodeDetail } from "@components/flow-builder/components/blocks/utils";

export function useNodeList(nodes: Node[]) {
  return useMemo(() => {
    return nodes
      .slice()
      .sort((a, b) => {
        if (a.type === BuilderNode.START) return -1;
        if (b.type === BuilderNode.START) return 1;
        if (a.type === BuilderNode.END) return 1;
        if (b.type === BuilderNode.END) return -1;
        return 0;
      })
      .map((n) => ({
        ...n,
        detail: getNodeDetail(n.type),
      }));
  }, [nodes]);
}
