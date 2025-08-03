import type { FinalConnectionState } from "@xyflow/react";
import { create } from "zustand";

interface State {
  anchorPosition: {
    x: number;
    y: number;
  };
  dropPosition: {
    x: number;
    y: number;
  };
  showMenu: boolean;
  incomingNodeMetadetails: FinalConnectionState | null;
}

interface Actions {
  actions: {
    setAnchorPosition: (position: { x: number; y: number }) => void;
    setDropPosition: (position: { x: number; y: number }) => void;
    setShowMenu: (show: boolean) => void;
    setIncomingNodeMetadetails: (detail: FinalConnectionState | null) => void;
  };
}

interface IAddNodeOnEdgeDropState extends State {
  actions: Actions["actions"];
}

export const useAddNodeOnEdgeDropStore = create<IAddNodeOnEdgeDropState>()(
  (set) => ({
    anchorPosition: { x: 0, y: 0 },
    dropPosition: { x: 0, y: 0 },
    showMenu: false,
    incomingNodeMetadetails: null,
    actions: {
      setAnchorPosition: (position) => set({ anchorPosition: position }),
      setDropPosition: (position) => set({ dropPosition: position }),
      setShowMenu: (show) => set({ showMenu: show }),
      setIncomingNodeMetadetails: (detail) =>
        set({ incomingNodeMetadetails: detail }),
    },
  })
);

export type AddNodeOnEdgeDropState = State;
