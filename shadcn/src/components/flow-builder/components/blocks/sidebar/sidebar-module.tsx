import { useFlowStore } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";
import { DesktopSidebarFragment } from "./fragments/desktop-sidebar-fragment";

export function SidebarModule() {
  const [activePanel, setActivePanel] = useFlowStore(
    useShallow((s) => [s.workflow.sidebar.active, s.actions.sidebar.setActivePanel])
  );

  return (
    <DesktopSidebarFragment
      activePanel={activePanel}
      setActivePanel={setActivePanel}
    />
  );
}
