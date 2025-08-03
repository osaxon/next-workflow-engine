"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/button-theme-toggle";
import { Card } from "@/components/ui/card";
import { CardWorkflow } from "@/components/ui/card-workflow";
import { Skeleton } from "@/components/ui/skeleton";
import { getWorkflows } from "@/services/get-workflows";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { isPending, data } = useQuery({
    queryKey: ["workflows"],
    queryFn: () => getWorkflows(),
  });

  return (
    <main className="h-full w-full ">
      <Card className=" h-14 border-0 from-primary/40 p-2 to-transparent rounded-none bg-gradient-to-r w-full  items-center flex justify-between border-b border-card-foreground/10">
        <div className="inline-flex items-center gap-2">
          <Icon
            icon="hugeicons:workflow-square-03"
            className="size-6 text-card-foreground"
          />
          <h1 className="text-card-foreground font-bold">
            Shadn Next Workflows
          </h1>
        </div>

        <ModeToggle />
      </Card>
      <div className="p-4">
        <div className="inline-flex w-full justify-between items-center gap-2">
          <h1 className="text-xl font-bold">
            ( {data?.length ?? 0} ) Workflows
          </h1>
          <Button
            variant="default"
            size="default"
            className="text-primary-foreground font-bold"
          >
            <Icon
              icon="mynaui:plus"
              className="size-6 text-primary-foreground"
            />
            Create Workflow
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4 ">
          {!isPending ? (
            data?.map((workflow) => (
              <CardWorkflow key={workflow.id} workflow={workflow} />
            ))
          ) : (
            <Skeleton className="bg-card-foreground/10 min-h-40 p-6 flex flex-col justify-between">
              <Skeleton className="bg-card-foreground/20 w-full h-8" />
              <div className="flex gap-2">
                <Skeleton className="bg-card-foreground/15 w-full h-6 mr-4" />
                <Skeleton className="bg-card-foreground/15 w-8 h-6 " />
                <Skeleton className="bg-card-foreground/15 w-8 h-6" />
              </div>
            </Skeleton>
          )}
        </div>
      </div>
    </main>
  );
}
