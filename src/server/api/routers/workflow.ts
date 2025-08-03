import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { Key } from "lucide-react";
import { z, ZodObject } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  workflows,
  workflowStepEdges,
  workflowSteps,
} from "~/server/db/schema";
import { WorkflowEngine } from "~/server/workflow-engine/main";
import { getWorkflow } from "~/services/get-workflow";
import { workflowSchema } from "~/stores/flow-store";

export const workflowRouter = createTRPCRouter({
  startFlow: publicProcedure
    .input(z.object({ workflowId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.workflowEngine.run(input.workflowId);
    }),
  insertFlow: publicProcedure
    .input(workflowSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        // 1. Create the workflow
        const [workflow] = await tx
          .insert(workflows)
          .values({
            name: input.name,
          })
          .returning({ id: workflows.id });

        if (!workflow) {
          tx.rollback();
          return;
        }

        // 2. Insert steps and build nodeId -> stepId map
        const stepIdMap: Record<string, number> = {};
        for (const node of input.nodes.filter(
          (n) => n.type !== "start" && n.type !== "end"
        )) {
          const config = Object.entries(node.data).map(([key, val]) => ({
            name: key,
            type:
              typeof val === "string"
                ? ("string" as const)
                : typeof val === "boolean"
                ? ("boolean" as const)
                : ("number" as const),
            value: val,
          }));

          const stepData: InferInsertModel<typeof workflowSteps> = {
            workflowId: workflow.id,
            config: config,
            outputValues: config[0]!,
            reactNodeId: node.id,
            workflowActionId: 1,
          };
          const [step] = await tx
            .insert(workflowSteps)
            .values(stepData)
            .returning({ id: workflowSteps.id });

          if (!step) {
            tx.rollback();
            return;
          }

          stepIdMap[node.id] = step?.id;
        }

        // 3. Insert edges using mapped step IDs
        for (const edge of input.edges) {
          // Only insert edges between actionable steps
          if (
            stepIdMap[edge.source] !== undefined &&
            stepIdMap[edge.target] !== undefined
          ) {
            const edgeData: InferInsertModel<typeof workflowStepEdges> = {
              workflowId: workflow.id,
              sourceStepId: stepIdMap[edge.source]!,
              targetStepId: stepIdMap[edge.target]!,
            };
            await tx.insert(workflowStepEdges).values(edgeData);
          }
        }
      });
    }),
  getWorkflow: publicProcedure
    .input(z.object({ workflowId: z.string() }))
    .query(async ({ input }) => {
      return await getWorkflow(input.workflowId);
    }),
});
