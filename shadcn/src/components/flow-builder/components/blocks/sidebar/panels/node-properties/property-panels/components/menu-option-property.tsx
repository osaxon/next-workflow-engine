import { MenuNodeData } from "@/components/flow-builder/components/blocks/nodes/menu-node/menu.node";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react/dist/iconify.js";

export const MenuOptionProperty = ({
  option,
  handleUpdateOption,
  handleRemoveNodeOption,
}: {
  option: MenuNodeData["options"][number];
  handleUpdateOption: (
    index: number,
    option: MenuNodeData["options"][number]
  ) => void;
  handleRemoveNodeOption: (optionId: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCursorGrabbing = attributes["aria-pressed"];

  return (
    <div className="mt-2 flex" ref={setNodeRef} key={option.id} style={style}>
      <Badge
        variant={"outline"}
        className=" group self-center mr-2 h-8 w-[34px] flex justify-center items-center border rounded-full text-center"
      >
        <p className="group-hover:hidden text-sm">{option.option.id + 1}</p>
        <Icon
          icon={"iconamoon:trash-fill"}
          className="hidden group-hover:block cursor-pointer text-red-400 "
          onClick={() => handleRemoveNodeOption(option.id)}
        />
      </Badge>
      <Input
        type="text"
        value={option.option.value}
        onChange={(e) =>
          handleUpdateOption(option.option.id, {
            ...option,
            option: { id: option.option.id, value: e.target.value },
          })
        }
        placeholder="Type an option here..."
      />
      <button
        {...attributes}
        {...listeners}
        className={` ${
          isCursorGrabbing ? "cursor-grabbing" : "cursor-grab"
        } ml-2`}
        aria-describedby={`DndContext-${option.id}`}
      >
        <svg viewBox="0 0 20 20" width="15">
          <path
            d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
            fill="currentColor"
          ></path>
        </svg>
      </button>
    </div>
  );
};
