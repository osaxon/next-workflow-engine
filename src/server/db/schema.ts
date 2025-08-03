// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, type InferInsertModel } from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `next-workflow-engine_${name}`
);

export type WorkflowActionInput =
  | { name: string; type: "string" }
  | { name: string; type: "number" }
  | { name: string; type: "boolean" }
  | { name: string; type: "array"; ofType: "string" | "number" | "boolean" }
  | { name: string; type: "stepOutput"; stepId: number; outputKey: string }
  | { name: string; type: "workflowInput"; inputKey: string };

export type ActionData = Record<string, any>;

type WorkflowStepConfig =
  | { name: string; type: "string"; value: string }
  | { name: string; type: "number"; value: number }
  | { name: string; type: "boolean"; value: boolean };
// | { name: string; type: "array"; ofType: "string"; value: string[] }
// | { name: string; type: "array"; ofType: "number"; value: number[] }
// | { name: string; type: "array"; ofType: "boolean"; value: boolean[] };

type WorkflowActionOutput =
  | { name: string; type: "string"; value: string }
  | { name: string; type: "number"; value: number }
  | { name: string; type: "boolean"; value: boolean }
  // | { name: string; type: "array"; ofType: "string" }
  // | { name: string; type: "array"; ofType: "number" }
  // | { name: string; type: "array"; ofType: "boolean" }
  | void;

// defines the workflow blueprint
export const workflows = createTable("workflows", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 256 }),
  createdBy: d.varchar({ length: 256 }),
}));

export const workflowRelations = relations(workflows, ({ many }) => ({
  steps: many(workflowSteps),
  edges: many(workflowStepEdges),
}));

// defined the reusable actions that can be used in a workflow
// Node type
export const workflowActions = createTable("workflow_actions", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 256 }), // should match up to react flow node "type"
  description: d.varchar({ length: 1000 }),
  inputs: d.jsonb().$type<ActionData>().notNull(),
  outputs: d.jsonb().$type<ActionData>(),
}));

// defines the steps in a workflow blueprint
// react flow equivalent = Node
export const workflowSteps = createTable("workflow_steps", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  workflowId: d
    .integer("workflow_id")
    .references(() => workflows.id)
    .notNull(),
  workflowActionId: d
    .integer("workflow_action_id")
    .references(() => workflowActions.id)
    .notNull(),
  reactNodeId: d.varchar({ length: 64 }).notNull(),
  config: d.jsonb().$type<ActionData>().notNull(),
  outputValues: d.jsonb().$type<ActionData>().notNull(),
}));

export const workflowStepRelations = relations(workflowSteps, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowSteps.workflowId],
    references: [workflows.id],
  }),
  action: one(workflowActions, {
    fields: [workflowSteps.workflowId],
    references: [workflowActions.id],
  }),
}));

export const workflowStepEdges = createTable("workflow_step_edges", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  workflowId: d
    .integer()
    .references(() => workflows.id)
    .notNull(),
  sourceStepId: d
    .integer()
    .references(() => workflowSteps.id)
    .notNull(),
  targetStepId: d
    .integer()
    .references(() => workflowSteps.id)
    .notNull(),
}));

export const workflowStepEdgeRelations = relations(
  workflowStepEdges,
  ({ one }) => ({
    workflow: one(workflows, {
      fields: [workflowStepEdges.workflowId],
      references: [workflows.id],
    }),
    sourceStep: one(workflowSteps, {
      fields: [workflowStepEdges.sourceStepId],
      references: [workflowSteps.id],
    }),
    targetStep: one(workflowSteps, {
      fields: [workflowStepEdges.sourceStepId],
      references: [workflowSteps.id],
    }),
  })
);

// TBC
export const workflowInstances = createTable("workflow_instances", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
}));

export const workflowStepInstances = createTable(
  "workflow_step_instances",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    workflowInstanceId: d.integer().notNull(),
    workflowActionId: d.integer().notNull(),
    inputValues: d.jsonb().notNull(),
    outputValues: d.jsonb(),
    status: d.varchar({ length: 32 }).notNull(),
    startedAt: d.timestamp({ withTimezone: true }),
    finishedAt: d.timestamp({ withTimezone: true }),
    error: d.varchar({ length: 2000 }), // Optional error message/log
  })
);

export type WorkflowStepInstance = InferInsertModel<
  typeof workflowStepInstances
>;

export const workflowActionSchema = createSelectSchema(workflowActions);

export type WorkflowAction = z.infer<typeof workflowActionSchema>;
