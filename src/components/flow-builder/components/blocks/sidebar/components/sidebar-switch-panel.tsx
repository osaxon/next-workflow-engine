import { PANEL_COMPONENTS } from "../constants/panels";

type SwitchSidebarPanelProps = Readonly<{
  active: "node-properties" | "available-nodes" | "none";
}>;

export function SwitchSidebarPanel({ active }: SwitchSidebarPanelProps) {
  const PanelComponent = PANEL_COMPONENTS[active];
  return PanelComponent ? <PanelComponent /> : null;
}
