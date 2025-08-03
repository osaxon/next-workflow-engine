"use client";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Card, CardHeader } from "./card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Icon } from "@iconify/react";
import { useFlowStore } from "@/stores/flow-store";

export const CardWorkflow = ({workflow}: {workflow: any}) => {
  const router = useRouter();
  const setWorkflow = useFlowStore(s => s.actions.setWorkflow)

  const handleOnEdit = () => {
    router.push("/workflow/"+workflow.id);
    setWorkflow(workflow);
  }
  return (
    <Card className="bg-card-foreground/10 min-h-40 p-0 flex flex-col justify-between">
      <CardHeader className="relative">
        <h1 className="text-card-foreground font-bold">{workflow.name}</h1>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary absolute right-2 top-0"
              onClick={handleOnEdit}
            >
              <Icon icon="mynaui:edit" className="size-6 text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Edit Workflow</p>
          </TooltipContent>
        </Tooltip>
      </CardHeader>

      <div className="inline-flex  justify-between items-center gap-2 border-t border-card-foreground/10 w-full">
        <p className="text-card-foreground/60 text-xs p-2">
          Updated:{" "}
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).format(new Date("10/19/2024, 11:14:46"))}
        </p>
        <div className="flex items-center p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icon
                  icon="mynaui:copy"
                  className="size-6 text-card-foreground/70"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Duplicate Workflow</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="xs">
                <Icon icon="mynaui:trash" className="size-6 text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Remove Workflow</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};
