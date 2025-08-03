import {
  Controls,
  type ReactFlowState,
  useReactFlow,
  useStore,
} from "@xyflow/react";
import { shallow } from "zustand/shallow";
import CustomControlButton from "./custom-control-button";
import { MaximizeIcon, MinusIcon, PlusIcon } from "lucide-react";

const ZOOM_DURATION = 500;

function selector(s: ReactFlowState) {
  return {
    minZoomReached: s.transform[2] <= s.minZoom,
    maxZoomReached: s.transform[2] >= s.maxZoom,
  };
}

export default function CustomControls() {
  const { maxZoomReached, minZoomReached } = useStore(selector, shallow);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <Controls
      showFitView={false}
      showZoom={false}
      showInteractive={false}
      position={"bottom-left"}
    >
      <CustomControlButton
        onClick={() => zoomIn({ duration: ZOOM_DURATION })}
        disabled={maxZoomReached}
      >
        <PlusIcon />
      </CustomControlButton>

      <CustomControlButton
        onClick={() => zoomOut({ duration: ZOOM_DURATION })}
        disabled={minZoomReached}
      >
        <MinusIcon />
      </CustomControlButton>

      <CustomControlButton onClick={() => fitView({ duration: ZOOM_DURATION })}>
        <MaximizeIcon />
      </CustomControlButton>
    </Controls>
  );
}
