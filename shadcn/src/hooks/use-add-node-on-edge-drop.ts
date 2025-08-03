"use client";
import { useAddNodeOnEdgeDropStore } from "@/stores/add-node-on-edge-drop-state";
import { type FinalConnectionState, useReactFlow } from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback, useRef } from "react";
import { useInsertNode } from "./use-insert-node";
import { useShallow } from "zustand/shallow";
import { BuilderNodeType } from "@/components/flow-builder/components/blocks/types";

export function useAddNodeOnEdgeDrop() {
  const [
    dropPosition,
    incomingNodeMetadetails,
    setAnchorPosition,
    setDropPosition,
    setShowMenu,
    setIncomingNodeMetadetails,
  ] = useAddNodeOnEdgeDropStore(
    useShallow((s) => [
      s.dropPosition,
      s.incomingNodeMetadetails,
      s.actions.setAnchorPosition,
      s.actions.setDropPosition,
      s.actions.setShowMenu,
      s.actions.setIncomingNodeMetadetails,
    ])
  );

  const { screenToFlowPosition, addEdges } = useReactFlow();
  const insertNode = useInsertNode();

  const floatingMenuWrapperRef = useRef<HTMLDivElement>(null);

  const handleAddConnectedNode = useCallback(
    (type: BuilderNodeType) => {
      if (
        !incomingNodeMetadetails ||
        !incomingNodeMetadetails.fromHandle ||
        !incomingNodeMetadetails.fromNode
      ) {
        return;
      }
      const newNode = insertNode(type, dropPosition);

      if (incomingNodeMetadetails.fromHandle.type === "source") {
        addEdges({
          id: nanoid(),
          type: "deletable",
          target: newNode.id,
          sourceHandle: incomingNodeMetadetails.fromHandle.id,
          source: incomingNodeMetadetails.fromNode.id,
        });
      } else if (incomingNodeMetadetails.fromHandle.type === "target") {
        addEdges({
          id: nanoid(),
          type: "deletable",
          target: incomingNodeMetadetails.fromNode.id,
          targetHandle: incomingNodeMetadetails.fromHandle.id,
          source: newNode.id,
        });
      }

      setShowMenu(false);
      setIncomingNodeMetadetails(null);
    },
    [
      insertNode,
      addEdges,
      setShowMenu,
      setIncomingNodeMetadetails,
      incomingNodeMetadetails,
      dropPosition,
    ]
  );

  const onConnectEnd = useCallback(
    (e: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      if (!connectionState.isValid && floatingMenuWrapperRef.current) {
        const { clientX, clientY } =
          "changedTouches" in e ? e.changedTouches[0] : e;

        const _anchorPositionPadding = 20;
        const _floatingMenuWrapperRect =
          floatingMenuWrapperRef.current.getBoundingClientRect();
        const _addNodeFloatingMenuAnchorPosition = {
          x:
            (clientX > _floatingMenuWrapperRect.width + _anchorPositionPadding
              ? _floatingMenuWrapperRect.width - _anchorPositionPadding
              : clientX < _anchorPositionPadding
              ? _anchorPositionPadding
              : clientX) - _floatingMenuWrapperRect.x,
          y:
            clientY > _floatingMenuWrapperRect.height + _anchorPositionPadding
              ? _floatingMenuWrapperRect.height - _anchorPositionPadding
              : clientY < _anchorPositionPadding
              ? _anchorPositionPadding
              : clientY - _floatingMenuWrapperRect.y,
        };

        setAnchorPosition(_addNodeFloatingMenuAnchorPosition);
        setShowMenu(true);
        setIncomingNodeMetadetails(connectionState);
        setDropPosition(screenToFlowPosition({ x: clientX, y: clientY }));
      }
    },
    [
      setAnchorPosition,
      setShowMenu,
      setIncomingNodeMetadetails,
      screenToFlowPosition,
      floatingMenuWrapperRef,
      setDropPosition,
    ]
  );

  return {
    handleOnEdgeDropConnectEnd: onConnectEnd,
    floatingMenuWrapperRef,
    handleAddConnectedNode,
  };
}
