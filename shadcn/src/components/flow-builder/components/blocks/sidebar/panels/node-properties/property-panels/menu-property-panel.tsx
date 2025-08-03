import { BuilderNodeType } from "@/components/flow-builder/components/blocks/types";

import { Input } from "@/components/ui/input";

import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import { nanoid } from "nanoid";

import { MenuNodeData } from "../../../../nodes/menu-node/menu.node";
import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import { MenuOptionProperty } from "./components/menu-option-property";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";

type MenuNodePropertyPanelProps = Readonly<{
  id: string;
  type: BuilderNodeType;
  data: MenuNodeData;
  updateData: (data: Partial<MenuNodeData>) => void;
}>;

export default function MenuNodePropertyPanel({
  id,
  data,
  updateData,
}: MenuNodePropertyPanelProps) {
  const { setNodes, setEdges } = useReactFlow();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleRemoveNodeOption = useCallback(
    (optionId: string) => {
      setNodes((nodes) =>
        produce(nodes, (draft) => {
          const node = draft.find((n) => n.id === id);

          if (node) {
            const options = node.data.options as MenuNodeData["options"];
            const pathIndex = options.findIndex((p) => p.id === optionId);

            if (pathIndex !== -1) {
              options.splice(pathIndex, 1);

              options
                .sort((a, b) => a.option.id - b.option.id)
                .forEach((option, index) => {
                  option.option.id = index;
                });
            }
          }
        })
      );

      setEdges((edges) =>
        edges.filter((edge) => edge.sourceHandle !== optionId)
      );
    },
    [id, setEdges, setNodes]
  );

  const handleUpdateOption = useCallback(
    (index: number, option: MenuNodeData["options"][number]) => {
      updateData({
        options: data.options.map((o, i) => (i === index ? option : o)),
      });
    },
    [data.options, updateData]
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      updateData({
        options: data.options.map((option) => {
          if (option.id === active.id) {
            return {
              ...option,
              option: {
                ...option.option,
                id: data.options.find((o) => o.id === over.id)!.option.id,
              },
            };
          } else if (option.id === over.id) {
            return {
              ...option,
              option: {
                ...option.option,
                id: data.options.find((o) => o.id === active.id)!.option.id,
              },
            };
          }
          return option;
        }),
      });
    }
  }

  const handleAddNodePath = useCallback(() => {
    setNodes((nodes) =>
      produce(nodes, (draft) => {
        const node = draft.find((n) => n.id === id);

        if (node) {
          (node.data.options as MenuNodeData["options"]).push({
            id: nanoid(),
            option: {
              id: data.options.length,
              value: "Option " + (data.options.length + 1),
            },
          });
        }
      })
    );
  }, [id, setNodes, data.options]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-xs text-card-foreground/20 self-end -mb-4">{id}</div>

      <div className="flex flex-col">
        <div className="text-xs text-card-foreground/60 font-semibold">
          Question
        </div>

        <div className="mt-2 flex">
          <Input
            type="text"
            value={data.question || ""}
            onChange={(e) => updateData({ question: e.target.value })}
            placeholder="Type your question here..."
          />
        </div>
        <div className="text-xs text-card-foreground/60 font-semibold mt-4">
          Options
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext
            items={data.options}
            strategy={verticalListSortingStrategy}
          >
            {Array.from(data.options)
              .sort((a, b) => a.option.id - b.option.id)
              .map((option) => (
                <MenuOptionProperty
                  key={option.id}
                  option={option}
                  handleRemoveNodeOption={handleRemoveNodeOption}
                  handleUpdateOption={handleUpdateOption}
                />
              ))}
          </SortableContext>
        </DndContext>

        <Button
          className="mt-4"
          size={"sm"}
          variant={"outline"}
          onClick={handleAddNodePath}
        >
          Add option
        </Button>
      </div>
    </div>
  );
}
