import { sql } from "drizzle-orm";
import { db } from "..";

export const workflowFullQuery = db.query.workflows
  .findFirst({
    where: (workflows, { eq }) => eq(workflows.id, sql.placeholder("id")),
    with: {
      edges: {
        with: {
          sourceStep: {
            with: {
              action: true,
            },
          },
          targetStep: {
            with: {
              action: true,
            },
          },
        },
      },
      steps: {
        with: {
          action: true,
        },
      },
    },
  })
  .prepare("workflow_full_detail");

export const workflowInstancesQuery = db.query.workflowInstances
  .findMany({
    where: (workflowInstances, { eq }) =>
      eq(workflowInstances.workflowId, sql.placeholder("id")),
    with: {
      stepInstances: true,
    },
  })
  .prepare("workflow_instances");
