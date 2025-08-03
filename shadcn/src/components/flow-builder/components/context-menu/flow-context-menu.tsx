import { AVAILABLE_NODES } from "../blocks";
import { useInsertNode } from "@/hooks/use-insert-node";
import { useCallback, useEffect, useState, useRef } from "react";
import { BuilderNode, BuilderNodeType } from "../blocks/types";
import { Icon } from "@iconify/react";
import { useReactFlow, useViewport, Node } from "@xyflow/react";
import { useFlowStore } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FlowContextMenuProps {
  children: React.ReactNode;
}

interface MenuPosition {
  x: number;
  y: number;
}

export function FlowContextMenu({ children }: FlowContextMenuProps) {
  const insertNode = useInsertNode();
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const viewport = useViewport();
  const [deleteNode, deleteEdge, showNodeProperties] = useFlowStore(
    useShallow((s) => [
      s.actions.nodes.deleteNode, 
      s.actions.edges.deleteEdge,
      s.actions.sidebar.showNodePropertiesOf
    ])
  );
  
  const [copiedNode, setCopiedNode] = useState<Node | null>(null);
  const [contextMenuType, setContextMenuType] = useState<'canvas' | 'node' | 'end-node'>('canvas');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNodeSubmenu, setShowNodeSubmenu] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout>();

  const handleAddNode = useCallback(
    (type: BuilderNodeType) => {
      if (!menuPosition) return;
      
      const rect = document.querySelector('.react-flow')?.getBoundingClientRect();
      if (rect) {
        const position = {
          x: (menuPosition.x - rect.left - viewport.x - 150) / viewport.zoom,
          y: (menuPosition.y - rect.top - viewport.y) / viewport.zoom,
        };
        insertNode(type, position);
        setIsMenuOpen(false);
      }
    },
    [insertNode, viewport, menuPosition]
  );

  const getSelectedNodes = useCallback(() => {
    return getNodes().filter(
      (node) => 
        node.selected && 
        node.type !== BuilderNode.START && 
        node.type !== BuilderNode.END
    );
  }, [getNodes]);

  const handleDeleteSelected = useCallback(() => {
    if (contextMenuType === 'end-node' && selectedNode) {
      deleteNode(selectedNode);
    } else if (contextMenuType === 'node' && selectedNode) {
      deleteNode(selectedNode);
    } else {
      const selectedNodes = getSelectedNodes();
      const selectedEdges = getEdges().filter((edge) => edge.selected);
      selectedNodes.forEach((node) => deleteNode(node));
      selectedEdges.forEach((edge) => deleteEdge(edge));
    }
    setIsMenuOpen(false);
  }, [getEdges, deleteNode, deleteEdge, getSelectedNodes, contextMenuType, selectedNode]);

  const handleSelectAll = useCallback(() => {
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        selected: node.type !== BuilderNode.START && node.type !== BuilderNode.END
      }))
    );
    setEdges((edges) =>
      edges.map((edge) => ({ ...edge, selected: true }))
    );
    setIsMenuOpen(false);
  }, [setNodes, setEdges]);

  const handleCopyNode = useCallback(() => {
    if (selectedNode) {
      setCopiedNode(selectedNode);
      toast.success("Node copied", {
        description: "Press Ctrl+V to paste the node",
        dismissible: true,
      });
      setIsMenuOpen(false);
    }
  }, [selectedNode]);

  const handlePasteNode = useCallback(() => {
    if (copiedNode && menuPosition) {
      const rect = document.querySelector('.react-flow')?.getBoundingClientRect();
      if (rect) {
        const position = {
          x: (menuPosition.x - rect.left - viewport.x) / viewport.zoom,
          y: (menuPosition.y - rect.top - viewport.y) / viewport.zoom,
        };
        insertNode(copiedNode.type as BuilderNodeType, position);
        setIsMenuOpen(false);
      }
    }
  }, [copiedNode, insertNode, viewport, menuPosition]);

  const findFreePosition = useCallback((baseNode: Node) => {
    const nodes = getNodes();
    const nodeSize = { width: 300, height: 150 }; // Approximate node size
    const padding = 20; // Space between nodes
    const positions = [
      { x: 1, y: 0 },  // right
      { x: 0, y: 1 },  // bottom
      { x: 1, y: 1 },  // bottom-right
      { x: -1, y: 0 }, // left
      { x: 0, y: -1 }, // top
      { x: -1, y: -1 }, // top-left
      { x: 1, y: -1 }, // top-right
      { x: -1, y: 1 }, // bottom-left
    ];

    for (const pos of positions) {
      const candidatePosition = {
        x: baseNode.position.x + pos.x * (nodeSize.width + padding),
        y: baseNode.position.y + pos.y * (nodeSize.height + padding)
      };

      // Check if this position overlaps with any existing node
      const hasOverlap = nodes.some(node => {
        if (node.id === baseNode.id) return false;
        const dx = Math.abs(node.position.x - candidatePosition.x);
        const dy = Math.abs(node.position.y - candidatePosition.y);
        return dx < nodeSize.width && dy < nodeSize.height;
      });

      if (!hasOverlap) {
        return candidatePosition;
      }
    }

    // If all positions are taken, return a position with offset
    return {
      x: baseNode.position.x + (nodeSize.width + padding),
      y: baseNode.position.y + (nodeSize.height + padding)
    };
  }, [getNodes]);

  const handleDuplicateNode = useCallback(() => {
    if (selectedNode) {
      const newPosition = findFreePosition(selectedNode);
      insertNode(selectedNode.type as BuilderNodeType, newPosition);
      toast.success("Node duplicated");
      setIsMenuOpen(false);
    }
  }, [selectedNode, insertNode, findFreePosition]);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const nodeElement = target.closest('.react-flow__node');
    
    if (nodeElement) {
      const nodeId = nodeElement.getAttribute('data-id');
      const node = getNodes().find(n => n.id === nodeId);
      if (node?.type === BuilderNode.END) {
        setContextMenuType('end-node');
        setSelectedNode(node);
      } else if (node?.type !== BuilderNode.START) {
        setNodes((nodes) =>
          nodes.map((n) => ({
            ...n,
            selected: n.id === nodeId
          }))
        );
        setContextMenuType('node');
        setSelectedNode(node || null);
      } else {
        setContextMenuType('canvas');
        setSelectedNode(null);
      }
    } else {
      setContextMenuType('canvas');
      setSelectedNode(null);
    }

    setMenuPosition({ x: event.clientX, y: event.clientY });
    setIsMenuOpen(true);
  }, [getNodes, setNodes]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isContextMenu = target.closest('.flow-context-menu');
      const isNodeSubmenu = target.closest('.node-submenu');
      
      if (!isContextMenu && !isNodeSubmenu) {
        setIsMenuOpen(false);
        setShowNodeSubmenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }

      if (event.key === 'Delete') {
        handleDeleteSelected();
      }
      
      if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        if (getNodes().length > 2) {
          handleSelectAll();
        }
      }

      if (event.key === 'c' && (event.ctrlKey || event.metaKey) && selectedNode) {
        event.preventDefault();
        handleCopyNode();
      }

      if (event.key === 'd' && (event.ctrlKey || event.metaKey) && selectedNode) {
        event.preventDefault();
        handleDuplicateNode();
      }

      if (event.key === 'v' && (event.ctrlKey || event.metaKey) && copiedNode) {
        event.preventDefault();
        handlePasteNode();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [handleDeleteSelected, handleSelectAll, handleCopyNode, handlePasteNode, handleDuplicateNode, selectedNode, copiedNode, getNodes]);

  const handleAddNodeTriggerEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setShowNodeSubmenu(true);
  }, []);

  const handleAddNodeTriggerLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setShowNodeSubmenu(false);
    }, 100);
  }, []);

  const handleSubmenuEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  }, []);

  const handleSubmenuLeave = useCallback(() => {
    setShowNodeSubmenu(false);
  }, []);

  const selectedCount = getSelectedNodes().length;
  const canSelectAll = getNodes().length > 2;

  const handleShowNodeProperties = useCallback(() => {
    if (selectedNode) {
      showNodeProperties({ 
        id: selectedNode.id, 
        type: selectedNode.type as BuilderNodeType 
      });
      setIsMenuOpen(false);
    }
  }, [selectedNode, showNodeProperties]);

  return (
    <>
      <div 
        className="flex h-full w-full"
        onContextMenu={handleContextMenu}
      >
        {children}
      </div>
      {isMenuOpen && menuPosition && (
        <div 
          className={cn(
            "flow-context-menu fixed z-50 min-w-[220px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none",
            "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          )}
          style={{
            left: menuPosition.x,
            top: menuPosition.y,
          }}
        >
          {contextMenuType === 'canvas' ? (
            <div className="space-y-1">
              <div className="relative">
                <button
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  )}
                  onMouseEnter={handleAddNodeTriggerEnter}
                  onMouseLeave={handleAddNodeTriggerLeave}
                >
                  <Icon icon="mynaui:plus" className="mr-2 h-4 w-4" />
                  Add Node
                  <Icon icon="lucide:chevron-right" className="ml-auto h-4 w-4" />
                </button>
                {showNodeSubmenu && (
                  <div 
                    className={cn(
                      "node-submenu absolute left-full top-0 ml-0.5 min-w-[180px] rounded-md border bg-popover p-1",
                      "animate-in fade-in-0 zoom-in-95"
                    )}
                    onMouseEnter={handleSubmenuEnter}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    {AVAILABLE_NODES.map((node) => (
                      <button
                        key={node.type}
                        className={cn(
                          "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                          "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        )}
                        onClick={() => handleAddNode(node.type as BuilderNodeType)}
                      >
                        <Icon icon={node.icon} className="mr-2 h-4 w-4" />
                        {node.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="h-px my-1 bg-border" />
              <button
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                  "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                  !canSelectAll && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleSelectAll}
                disabled={!canSelectAll}
              >
                <Icon icon="mynaui:select-all" className="mr-2 h-4 w-4" />
                Select All
                <span className="ml-auto text-xs text-muted-foreground">Ctrl+A</span>
              </button>
              {copiedNode && (
                <button
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  )}
                  onClick={handlePasteNode}
                >
                  <Icon icon="mynaui:paste" className="mr-2 h-4 w-4" />
                  Paste Node
                  <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span>
                </button>
              )}
              {selectedCount > 0 && (
                <>
                  <div className="h-px my-1 bg-border" />
                  <button
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-red-600",
                      "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                    onClick={handleDeleteSelected}
                  >
                    <Icon icon="mynaui:trash" className="mr-2 h-4 w-4" />
                    Delete {selectedCount} {selectedCount === 1 ? 'Node' : 'Nodes'}
                    <span className="ml-auto text-xs text-muted-foreground">Del</span>
                  </button>
                </>
              )}
            </div>
          ) : contextMenuType === 'end-node' ? (
            <div className="space-y-1">
              <button
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-red-600",
                  "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                )}
                onClick={handleDeleteSelected}
              >
                <Icon icon="mynaui:trash" className="mr-2 h-4 w-4" />
                Delete End Node
                <span className="ml-auto text-xs text-muted-foreground">Del</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <button
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                  "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                )}
                onClick={handleShowNodeProperties}
              >
                <Icon icon="mynaui:settings" className="mr-2 h-4 w-4" />
                Open Settings
                <span className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon icon="mynaui:settings" className="h-3 w-3" />
                  Alt+O
                </span>
              </button>
              <div className="h-px my-1 bg-border" />
              <button
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                  "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                )}
                onClick={handleCopyNode}
              >
                <Icon icon="mynaui:copy" className="mr-2 h-4 w-4" />
                Copy Node
                <span className="ml-auto text-xs text-muted-foreground">Ctrl+C</span>
              </button>
              <button
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                  "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                )}
                onClick={handleDuplicateNode}
              >
                <Icon icon="ph:copy-simple-duotone" className="mr-2 h-4 w-4" />
                Duplicate Node
                <span className="ml-auto text-xs text-muted-foreground">Ctrl+D</span>
              </button>
              <div className="h-px my-1 bg-border" />
              <button
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-red-600",
                  "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                )}
                onClick={handleDeleteSelected}
              >
                <Icon icon="mynaui:trash" className="mr-2 h-4 w-4" />
                Delete Node
                <span className="ml-auto text-xs text-muted-foreground">Del</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
} 