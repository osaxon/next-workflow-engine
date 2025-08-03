import type { ComponentType } from "react";
import AvailableNodesPanel from "../panels/available-nodes/available-nodes-panel";
import { NodePropertiesPanel } from "../panels/node-properties/node-properties-panel";

export const PANEL_COMPONENTS: Record<
  "node-properties" | "available-nodes" | "none",
  ComponentType
> = {
  "available-nodes": AvailableNodesPanel,
  "node-properties": NodePropertiesPanel,
  none: () => null,
};
