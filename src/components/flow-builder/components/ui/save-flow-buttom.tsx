import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "sonner";
import z from "zod";
import { useShallow } from "zustand/shallow";
import { Button } from "~/components/ui/button";
import { useFlowValidator } from "~/hooks/use-flow-validator";
import { useFlowStore, workflowSchema } from "~/stores/flow-store";
import { api } from "~/trpc/react";

const actionMap = {
  wait: 1,
};

export const SaveFlowButton = () => {
  const [saveWorkflow] = useFlowStore(
    useShallow((s) => [s.actions.saveWorkflow])
  );
  const insert = api.workflow.insertFlow.useMutation();

  const [isValidating, validateFlow] = useFlowValidator((isValid) => {
    if (isValid) {
      const workflow = saveWorkflow();
      console.log(workflow, "<----- save workflow data");
      const parsed = workflowSchema.safeParse(workflow);

      if (!parsed.success && !parsed.data) {
        console.log(z.prettifyError(parsed.error));
        return;
      }

      try {
        insert.mutate(parsed.data);
      } catch (err) {
        toast.error("error", {
          description: JSON.stringify(err),
        });
        throw new Error("error inserting flow");
      }
    } else
      toast.error("Flow is invalid", {
        description:
          "Please check if the flow is complete and has no lone nodes",
      });
  });

  return (
    <Button
      onClick={validateFlow}
      disabled={isValidating}
      variant="secondary"
      size={"sm"}
      className=" flex gap-4"
    >
      <Icon icon="fluent:save-28-filled" /> Save Flow
    </Button>
  );
};
