import { nanoid } from "nanoid";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import { create } from "zustand";

import { produce } from "immer";
import {
  BuilderNode,
  type BuilderNodeType,
} from "~/components/flow-builder/components/blocks/types";
import type { Tag } from "~/types/tag";
import z from "zod";
import type { WorkflowSchema } from "~/services/get-workflow";

export const workflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  edges: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
      id: z.string(),
      type: z.string(),
    })
  ),
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      data: z.record(z.string(), z.any()),
      deletable: z.boolean().optional(),
      selected: z.boolean(),
      measured: z.object({
        width: z.number(),
        height: z.number(),
      }),
      position: z.object({
        x: z.number(),
        y: z.number(),
      }),
      dragging: z.boolean(),
    })
  ),
  sidebar: z.object({
    active: z.union([
      z.literal("node-properties"),
      z.literal("available-nodes"),
      z.literal("none"),
    ]),
    panels: z.object({
      nodeProperties: z.object({
        selectedNode: z
          .object({
            id: z.string(),
            type: z.enum(BuilderNode),
          })
          .nullable(),
      }),
    }),
  }),
});

interface State {
  nodes: Node[];
  edges: Edge[];
  sidebar: {
    active: "node-properties" | "available-nodes" | "none" | string; // TODO fix with zod
    panels: {
      nodeProperties: {
        selectedNode: { id: string; type: BuilderNodeType } | null | undefined;
      };
    };
  };
}

interface Actions {
  actions: {
    saveWorkflow: () => {
      id: string;
      name: string;
      nodes: Node[];
      edges: Edge[];
    };
    initialiseWorkflow: () => WorkflowSchema;
    setWorkflow: (workflow: IFlowState["workflow"]) => void;
    nodes: {
      onNodesChange: (changes: NodeChange[]) => void;
      setNodes: (nodes: Node[]) => void;
      deleteNode: (node: Node) => void;
    };
    edges: {
      onEdgesChange: (changes: EdgeChange[]) => void;
      onConnect: (connection: Connection) => void;
      setEdges: (edges: Edge[]) => void;
      deleteEdge: (edge: Edge) => void;
    };
    sidebar: {
      setActivePanel: (
        panel: "node-properties" | "available-nodes" | "none"
      ) => void;
      showNodePropertiesOf: (node: {
        id: string;
        type: BuilderNodeType;
      }) => void;
      panels: {
        nodeProperties: {
          setSelectedNode: (
            node: { id: string; type: BuilderNodeType } | undefined | null
          ) => void;
        };
        tags: {
          setTags: (tags: Tag[]) => void;
          createTag: (tag: Tag) => void;
          deleteTag: (tag: Tag) => void;
          updateTag: (tag: Tag, newTag: Tag) => void;
        };
      };
    };
  };
}

export const workflowStateSchema = workflowSchema.extend(
  z.object({
    id: z.string(),
    name: z.string(),
  })._zod
);

export interface IFlowState {
  tags: Tag[];
  workflow: {
    id: string;
    name: string;
  } & State;
  actions: Actions["actions"];
}

const TAGS = [
  {
    value: "marketing",
    label: "Marketing",
    color: "#ef4444",
  },
  {
    value: "support",
    label: "Support",
    color: "#ef4444",
  },
  {
    value: "lead",
    label: "Lead",
    color: "#eab308",
  },
  {
    value: "new",
    label: "New",
    color: "#22c55e",
  },
] satisfies Tag[];

const initFlow = {
  id: nanoid(),
  name: "placeholder",
  edges: [] as WorkflowSchema["edges"],
  nodes: [] as WorkflowSchema["nodes"],
  sidebar: {
    active: "none",
    panels: {
      nodeProperties: {
        selectedNode: null,
      },
    },
  } as WorkflowSchema["sidebar"],
};

export const useFlowStore = create<IFlowState>()((set, get) => ({
  tags: TAGS,
  workflow: initFlow,
  actions: {
    saveWorkflow: () => {
      const { workflow } = get();
      set({ workflow });
      return workflow;
    },
    initialiseWorkflow: () => {
      set({ workflow: initFlow });
      return initFlow;
    },
    setWorkflow: (workflow: IFlowState["workflow"]) => {
      set((state) => ({
        workflow: {
          ...state.workflow,
          ...workflow,
        },
      }));
    },
    sidebar: {
      setActivePanel: (panel: "node-properties" | "available-nodes" | "none") =>
        set((state) => ({
          workflow: {
            ...state.workflow,
            sidebar: { ...state.workflow.sidebar, active: panel },
          },
        })),
      showNodePropertiesOf: (node: { id: string; type: BuilderNodeType }) => {
        set((state) => ({
          workflow: {
            ...state.workflow,
            sidebar: {
              ...state.workflow.sidebar,
              active: "node-properties",
              panels: {
                ...state.workflow.sidebar.panels,
                nodeProperties: {
                  ...state.workflow.sidebar.panels.nodeProperties,
                  selectedNode: node,
                },
              },
            },
          },
        }));
      },
      panels: {
        nodeProperties: {
          setSelectedNode: (
            node: { id: string; type: BuilderNodeType } | undefined | null
          ) =>
            set((state) => ({
              workflow: {
                ...state.workflow,
                sidebar: {
                  ...state.workflow.sidebar,
                  panels: {
                    ...state.workflow.sidebar.panels,
                    nodeProperties: {
                      ...state.workflow.sidebar.panels.nodeProperties,
                      selectedNode: node,
                    },
                  },
                },
              },
            })),
        },
        tags: {
          setTags: (tags: Tag[]) => set({ tags }),
          createTag: (tag: Tag) =>
            set((state) => ({
              tags: [...state.tags, tag],
            })),
          updateTag: (tag: Tag, newTag: Tag) =>
            set((state) => ({
              tags: state.tags.map((f) => (f.value === tag.value ? newTag : f)),
            })),
          deleteTag: (tag: Tag) =>
            set((state) => ({
              tags: state.tags.filter((f) => f.value !== tag.value),
            })),
        },
      },
    },
    nodes: {
      onNodesChange: (changes) => {
        set((state) =>
          produce(state, (draft) => {
            const updatedNodes = applyNodeChanges(
              changes,
              draft.workflow.nodes
            );

            draft.workflow.nodes = updatedNodes;
          })
        );
      },
      setNodes: (nodes) => {
        set({ workflow: { ...get().workflow, nodes } });
      },
      deleteNode: (node: Node) => {
        set((state) => ({
          workflow: {
            ...state.workflow,
            nodes: state.workflow.nodes.filter((n) => n.id !== node.id),
          },
        }));
      },
    },
    edges: {
      onEdgesChange: (changes) => {
        set((state) =>
          produce(state, (draft) => {
            const updatedEdges = applyEdgeChanges(
              changes,
              draft.workflow.edges
            );

            draft.workflow.edges = updatedEdges;
          })
        );
      },
      onConnect: (connection) => {
        const edge = { ...connection, id: nanoid(), type: "deletable" } as Edge;
        set({
          workflow: {
            ...get().workflow,
            edges: addEdge(edge, get().workflow.edges),
          },
        });
      },
      setEdges: (edges) => {
        set({ workflow: { ...get().workflow, edges } });
      },
      deleteEdge: (edge: Edge) => {
        set((state) => ({
          workflow: {
            ...state.workflow,
            edges: state.workflow.edges.filter((e) => e.id !== edge.id),
          },
        }));
      },
    },
  },
}));

export function transformFlowStateToBackend(
  workflow: {
    id: string;
    name: string;
    nodes: Node[];
    edges: Edge[];
  },
  actionMap: Record<string, number>
) {
  // Filter actionable nodes
  const steps = workflow.nodes
    .filter((n) => n.type !== "start" && n.type !== "end")
    .map((node) => ({
      reactNodeId: node.id,
      workflowActionId: actionMap[node.type!],
      config: Object.entries(node.data).map(([key, val]) => ({
        name: key,
        type: typeof val,
        value: val,
      })),
      // outputValues: ... (set as needed)
    }));

  // Edges: keep source/target node IDs for BE to resolve
  const edges = workflow.edges.map((edge) => ({
    source: edge.source,
    target: edge.target,
  }));

  return {
    name: workflow.name,
    steps,
    edges,
  };
}
