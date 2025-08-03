"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Edit2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag } from "@/types/tag";
import { useFlowStore } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";

const badgeStyle = (color: string) => ({
  borderColor: `${color}20`,
  backgroundColor: `${color}30`,
  color,
});

export function TagsCombobox({
  value,
  onValueChange,
  maxItems,
}: {
  value: string[];
  onValueChange: (value: string[]) => void;
  maxItems?: number;
}) {
  const [tags, updateTag, deleteTag, createTag] = useFlowStore(
    useShallow((s) => [
      s.tags,
      s.actions.sidebar.panels.tags.updateTag,
      s.actions.sidebar.panels.tags.deleteTag,
      s.actions.sidebar.panels.tags.createTag,
    ])
  );
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedValues, setSelectedValues] = React.useState<Tag[]>(
    value.map((t) => tags.find((f) => f.value === t) || {value: t, label: t[0].toUpperCase() + t.substring(1), color: "#cecece"})
  );

  React.useEffect(() => {
    setSelectedValues(value.map((t) => tags.find((f) => f.value === t) || {value: t, label: t[0].toUpperCase() + t.substring(1), color: "#cecece"}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleCreateTag = (name: string) => {
    const newTag = {
      value: name.toLowerCase(),
      label: name[0].toUpperCase() + name.substring(1),
      color: "#cecece",
    };

    createTag(newTag);
    onValueChange([...value, newTag.value]);
    setSelectedValues((prev) => [...prev, newTag]);
  };

  const toggleTag = (tag: Tag) => {
    setSelectedValues((currentTags) =>
      !currentTags.includes(tag)
        ? [...currentTags, tag]
        : currentTags.filter((l) => l.value !== tag.value)
    );
    inputRef?.current?.focus();

    if (value.includes(tag.value)) {
      return onValueChange(value.filter((f) => f !== tag.value));
    }

    onValueChange([...value, tag.value]);
  };

  const handleUpdateTag = (tag: Tag, newTag: Tag) => {
    updateTag(tag, newTag);
    setSelectedValues((prev) =>
      prev.map((f) => (f.value === tag.value ? newTag : f))
    );
  };

  const handleDeleteTag = (tag: Tag) => {
    deleteTag(tag);
    onValueChange(value.filter((f) => f !== tag.value));
    setSelectedValues((prev) => prev.filter((f) => f.value !== tag.value));
  };

  const onComboboxOpenChange = (value: boolean) => {
    inputRef.current?.blur();
    setOpenCombobox(value);
  };

  const mergeArraysUnique = (arr1: Tag[], arr2 : Tag[]) => {
    const map = new Map();

    arr1.concat(arr2).forEach(item => {
        map.set(item.value, item); 
    });

    return Array.from(map.values());
};

  return (
    <div className="w-full mb-8">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="w-full justify-between text-foreground"
          >
            <span className="truncate">
              {selectedValues.length === 0 && "Select tags"}
              {selectedValues.length === 1 && selectedValues[0].label}
              {selectedValues.length === 2 &&
                selectedValues.map(({ label }) => label).join(", ")}
              {selectedValues.length > 2 &&
                `${selectedValues.length} tags selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Search tag..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandGroup className="max-h-[145px] overflow-auto">
                {mergeArraysUnique(tags, selectedValues).map((tag) => {
                  const isActive = selectedValues.includes(tag);
                  return (
                    <CommandItem
                      key={tag.value}
                      value={tag.value}
                      onSelect={() => toggleTag(tag)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1">{tag.label}</div>
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                    </CommandItem>
                  );
                })}
                <CommandItemCreate
                  onSelect={() => handleCreateTag(inputValue)}
                  {...{ inputValue, tags }}
                />
              </CommandGroup>
              <CommandSeparator alwaysRender />
              <CommandGroup>
                <CommandItem
                  value={`:${inputValue}:`}
                  className="text-xs text-muted-foreground"
                  onSelect={() => setOpenDialog(true)}
                >
                  <div className={cn("mr-2 h-4 w-4")} />
                  <Edit2 className="mr-2 h-2.5 w-2.5" />
                  Edit Tags
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          if (!open) {
            setOpenCombobox(true);
          }
          setOpenDialog(open);
        }}
      >
        <DialogContent className="flex max-h-[90vh]  flex-col">
          <DialogHeader>
            <DialogTitle>Edit Tags</DialogTitle>
            <DialogDescription>
              Change the tag names or delete the tags. Create a tag through the
              combobox though.
            </DialogDescription>
          </DialogHeader>
          <div className="-mx-6 flex-1 overflow-y-scroll px-6 py-2">
            {mergeArraysUnique(tags, selectedValues).map((tag) => {
              return (
                <DialogListItem
                  key={tag.value}
                  onDelete={() => handleDeleteTag(tag)}
                  onSubmit={(e) => {
                    e.preventDefault();
                    const target = e.target as typeof e.target &
                      Record<"name" | "color", { value: string }>;
                    const newTag = {
                      value: target.name.value.toLowerCase(),
                      label: target.name.value,
                      color: target.color.value,
                    };
                    handleUpdateTag(tag, newTag);
                  }}
                  {...tag}
                />
              );
            })}
          </div>
          <DialogFooter className="bg-opacity-40">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="relative -mb-24 mt-3 h-24 overflow-y-auto">
        {selectedValues.map(({ label, value, color }) => (
          <Badge
            key={value}
            variant="outline"
            style={badgeStyle(color)}
            className="mb-2 mr-2"
          >
            {label}
          </Badge>
        ))}
      </div>
    </div>
  );
}

const CommandItemCreate = ({
  inputValue,
  tags,
  onSelect,
}: {
  inputValue: string;
  tags: Tag[];
  onSelect: () => void;
}) => {
  const hasNoTag = !tags
    .map(({ value }) => value)
    .includes(`${inputValue.toLowerCase()}`);

  const render = inputValue !== "" && hasNoTag;

  if (!render) return null;

  return (
    <CommandItem
      key={`${inputValue}`}
      value={`${inputValue}`}
      className="text-xs text-muted-foreground"
      onSelect={onSelect}
    >
      <div className={cn("mr-2 h-4 w-4")} />
      Create new tag &quot;{inputValue}&quot;
    </CommandItem>
  );
};

const DialogListItem = ({
  value,
  label,
  color,
  onSubmit,
  onDelete,
}: Tag & {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [accordionValue, setAccordionValue] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<string>(label);
  const [colorValue, setColorValue] = React.useState<string>(color);
  const disabled = label === inputValue && color === colorValue;

  React.useEffect(() => {
    if (accordionValue !== "") {
      inputRef.current?.focus();
    }
  }, [accordionValue]);

  return (
    <Accordion
      key={value}
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      <AccordionItem value={value}>
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" style={badgeStyle(color)}>
              {label}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <AccordionTrigger>Edit</AccordionTrigger>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="xs">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to delete the label{" "}
                    <Badge variant="outline" style={badgeStyle(color)}>
                      {label}
                    </Badge>{" "}
                    .
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <AccordionContent>
          <form
            className="flex items-end gap-4"
            onSubmit={(e) => {
              onSubmit(e);
              setAccordionValue("");
            }}
          >
            <div className="grid w-full gap-3 ">
              <Label htmlFor="name">Label name</Label>
              <Input
                ref={inputRef}
                id="name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="h-8 ml-1"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value)}
                className="h-8 px-2 py-1"
              />
            </div>
            {/* REMINDER: size="xs" */}
            <Button type="submit" disabled={disabled} size="xs">
              Save
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
