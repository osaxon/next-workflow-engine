"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Background,
  type EdgeTypes,
  type NodeChange,
  ReactFlow,
  SelectionMode,
  useReactFlow,
} from "@xyflow/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { useAddNodeOnEdgeDrop } from "~/hooks/use-add-node-on-edge-drop";
import { useDeleteKeyCode } from "~/hooks/use-delete-key-code";
import { useDragDropFlowBuilder } from "~/hooks/use-drag-drop-flow-builder";
import { useIsValidConnection } from "~/hooks/use-is-valid-connection";
import { useNodeAutoAdjust } from "~/hooks/use-node-auto-adjust";
import { useOnNodesDelete } from "~/hooks/use-on-nodes-delete";
import { cn } from "~/lib/utils";
import { useFlowStore } from "~/stores/flow-store";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import AddNodeFloatingMenu from "./components/add-node-floating-menu/add-node-floating-menu";
import { NODE_TYPES } from "./components/blocks";
import { BuilderNode } from "./components/blocks/types";
import { FlowContextMenu } from "./components/context-menu/flow-context-menu";
import CustomControls from "./components/controls/custom-controls";
import CustomDeletableEdge from "./components/edges/custom-deletable-edge";
import { SaveFlowButton } from "./components/ui/save-flow-buttom";

const edgeTypes: EdgeTypes = {
  deletable: CustomDeletableEdge,
};

export const FlowBuilder = () => {
  const router = useRouter();

  const [
    name,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteNode,
    deleteEdge,
  ] = useFlowStore(
    useShallow((s) => [
      s.workflow.name,
      s.workflow.nodes,
      s.workflow.edges,
      s.actions.nodes.onNodesChange,
      s.actions.edges.onEdgesChange,
      s.actions.edges.onConnect,
      s.actions.nodes.deleteNode,
      s.actions.edges.deleteEdge,
    ])
  );
  const { getNodes } = useReactFlow();

  const {
    handleOnEdgeDropConnectEnd,
    floatingMenuWrapperRef,
    handleAddConnectedNode,
  } = useAddNodeOnEdgeDrop();

  const deleteKeyCode = useDeleteKeyCode();
  const onNodesDelete = useOnNodesDelete(nodes);

  const [onDragOver, onDrop] = useDragDropFlowBuilder();
  const isValidConnection = useIsValidConnection(nodes, edges);

  const autoAdjustNode = useNodeAutoAdjust();

  const handleAutoAdjustNodeAfterNodeMeasured = useCallback(
    (id: string) => {
      setTimeout(() => {
        const node = getNodes().find((n) => n.id === id);
        if (!node) {
          return;
        }

        if (node.measured === undefined) {
          handleAutoAdjustNodeAfterNodeMeasured(id);
          return;
        }

        autoAdjustNode(node);
      });
    },
    [autoAdjustNode, getNodes]
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const filteredChanges = changes.map((change) => {
        if (change.type === "select") {
          const node = nodes.find((n) => n.id === change.id);
          if (
            node &&
            (node.type === BuilderNode.START || node.type === BuilderNode.END)
          ) {
            return { ...change, selected: false };
          }
        }
        return change;
      });

      filteredChanges.forEach((change) => {
        if (change.type === "dimensions") {
          const node = getNodes().find((n) => n.id === change.id);
          if (node) {
            autoAdjustNode(node);
          }
        }

        if (change.type === "add") {
          handleAutoAdjustNodeAfterNodeMeasured(change.item.id);
        }
      });
      onNodesChange(filteredChanges);
    },
    [
      autoAdjustNode,
      getNodes,
      handleAutoAdjustNodeAfterNodeMeasured,
      onNodesChange,
      nodes,
    ]
  );

  const handleDeleteElements = useCallback(() => {
    const selectedNodes = nodes.filter(
      (node) =>
        node.selected &&
        node.type !== BuilderNode.START &&
        node.type !== BuilderNode.END
    );
    const selectedEdges = edges.filter((edge) => edge.selected);

    selectedNodes.forEach((node) => deleteNode(node));
    selectedEdges.forEach((edge) => deleteEdge(edge));
  }, [nodes, edges, deleteNode, deleteEdge]);

  return (
    <>
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground font-bold"
              onClick={() => router.back()}
            >
              <Icon
                icon="ion:arrow-back-outline"
                className="size-6 text-card-foreground"
              />
            </Button>
            <h1 className="text-card-foreground font-bold">{name}</h1>
          </div>

          {name !== "" && (
            <div className="inline-flex items-center gap-2">
              <SaveFlowButton />
            </div>
          )}
        </CardContent>
      </Card>
      <div className="relative w-full h-[94vh]">
        <FlowContextMenu>
          <ReactFlow
            proOptions={{ hideAttribution: true }}
            onInit={({ fitView }) => fitView().then()}
            nodeTypes={NODE_TYPES}
            nodes={nodes}
            onNodesChange={handleNodesChange}
            edgeTypes={edgeTypes}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectEnd={handleOnEdgeDropConnectEnd}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDragStop={(_, node) => {
              autoAdjustNode(node);
            }}
            onNodesDelete={handleDeleteElements}
            isValidConnection={isValidConnection}
            selectionMode={SelectionMode.Full}
            multiSelectionKeyCode="Control"
            selectionOnDrag={true}
            selectionKeyCode={null}
            deleteKeyCode={deleteKeyCode}
            snapGrid={[16, 16]}
            snapToGrid
            fitView
          >
            <Background gap={24} />
            <CustomControls />
          </ReactFlow>
        </FlowContextMenu>
      </div>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 backdrop-blur-3xl transition-all",
          "opacity-0 bg-zinc-800/0 backdrop-saturate-100 pointer-events-none"
        )}
      >
        <div ref={floatingMenuWrapperRef} className="relative size-full">
          <AddNodeFloatingMenu onNodeAdd={handleAddConnectedNode} />
        </div>
      </div>
    </>
  );
};
