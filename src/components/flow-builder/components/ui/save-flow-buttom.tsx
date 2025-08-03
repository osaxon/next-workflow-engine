import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "sonner";
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

  const parsed = workflowSchema.safeParse(saveWorkflow());

  if (!parsed.success) {
    console.error(parsed.error);
  }

  if (parsed.success) {
    console.log(parsed.data, "<--- parsed workflow");
  }

  const [isValidating, validateFlow] = useFlowValidator((isValid) => {
    if (isValid) {
      const workflow = saveWorkflow();
      console.log(workflow, "<----- the workflow");
      toast.success("Flow is valid", {
        description: "You can now proceed to the next step",
        dismissible: true,
      });
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
