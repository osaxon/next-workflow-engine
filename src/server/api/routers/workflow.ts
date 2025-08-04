import { eq, type InferInsertModel } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  workflowActions,
  workflows,
  workflowStepEdges,
  workflowSteps,
} from "~/server/db/schema";
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
          console.error("error creating workflow");
          tx.rollback();
          throw new Error("error creating workflow");
        }

        // 2. Insert steps and build nodeId -> stepId map
        const stepIdMap: Record<string, number> = {};

        for (const node of input.nodes) {
          const workflowActionDb = await tx.query.workflowActions.findFirst({
            where: eq(workflowActions.name, node.type),
          });

          if (!workflowActionDb) {
            tx.rollback();
            console.log(node.type);
            console.error("error finding action");
            throw new Error("unable to find action");
          }

          const stepData: InferInsertModel<typeof workflowSteps> = {
            workflowId: workflow.id,
            config: node.data,
            reactNodeId: node.id,
            workflowActionId: workflowActionDb?.id,
            outputValues: node.data,
            positionX: node.position.x,
            positionY: node.position.y,
            width: 300,
            height: 150,
          };

          const [step] = await tx
            .insert(workflowSteps)
            .values(stepData)
            .returning({ id: workflowSteps.id });

          if (!step) {
            console.error("error creating step");
            tx.rollback();

            throw new Error("error creating step");
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
    .input(z.object({ workflowId: z.number() }))
    .query(async ({ input }) => {
      const workflow = await getWorkflow(input.workflowId);
      return workflow;
    }),
});
