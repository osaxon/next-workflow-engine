import * as React from "react";

import { cn } from "@/lib/utils";
import { HeaderWithIcon } from "./header-with-icon";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";
import { HeaderGradientColors } from "../blocks/types";

const NodeCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-72 border border-card-foreground/10 rounded-xl bg-card/50 shadow-sm backdrop-blur-xl transition divide-y divide-card-foreground/10 data-[selected=true]:border-primary",
      className
    )}
    {...props}
  />
));
NodeCard.displayName = "NodeCard";

interface NodeCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: string;
  title: string;
  handleDeleteNode: () => void;
  handleShowNodeProperties: () => void;
  gradientColor?: keyof typeof HeaderGradientColors;
}

const NodeCardHeader = React.forwardRef<HTMLDivElement, NodeCardHeaderProps>(
  (
    {
      className,
      icon,
      title,
      handleDeleteNode,
      handleShowNodeProperties,
      gradientColor,
      ...props
    },
    ref
  ) => {
    const gradientColorClass =
      HeaderGradientColors[gradientColor as keyof typeof HeaderGradientColors];
    return (
      <div
        ref={ref}
        className={`relative overflow-clip rounded-t-xl bg-card/50 ${className}`}
        {...props}
      >
        <div className="absolute inset-0">
          <div
            className={`absolute h-full w-3/5 ${
              gradientColor ? gradientColorClass : "from-primary/40"
            } to-transparent bg-gradient-to-r`}
          />
        </div>

        <div className="relative h-9 flex items-center justify-between gap-x-4 px-0.5 py-0.5">
          <div className="flex grow items-center pl-1">
            <HeaderWithIcon icon={icon} title={title} />
          </div>

          <div className="flex shrink-0 items-center gap-x-0.5 pr-0.5">
            <div className="mx-1 h-4 w-px bg-card-foreground/10" />

            <Button
              type="button"
              size={"icon"}
              variant={"ghost"}
              className="size-7"
              onClick={handleShowNodeProperties}
            >
              <Icon icon={"mynaui:cog-solid"} className={"size-4"} />
            </Button>

            <Button
              type="button"
              variant={"ghost"}
              size={"icon"}
              className="size-7"
              onClick={handleDeleteNode}
            >
              <Icon
                icon={"basil:trash-solid"}
                className={"size-4 text-red-500"}
              />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
NodeCardHeader.displayName = "NodeCardHeader";

interface NodeCardDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  description: string;
}

const NodeCardDescription = React.forwardRef<
  HTMLDivElement,
  NodeCardDescriptionProps
>(({ className, description, ...props }, ref) => (
  <div ref={ref} className={cn("px-4 py-2", className)} {...props}>
    <div className="text-xs text-card-foreground">{description}</div>
  </div>
));
NodeCardDescription.displayName = "NodeCardDescription";

const NodeCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col divide-y divide-card-foreground/10",
      className
    )}
    {...props}
  />
));
NodeCardContent.displayName = "NodeCardContent";

interface NodeCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  nodeId: string | number;
}

const NodeCardFooter = React.forwardRef<HTMLDivElement, NodeCardFooterProps>(
  ({ className, nodeId, ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-card-foreground/10 overflow-clip rounded-b-md px-4 py-2 text-[10px] text-card-foreground/50 ${className}`}
      {...props}
    >
      Node: <span className="font-semibold">#{nodeId}</span>
    </div>
  )
);
NodeCardFooter.displayName = "NodeCardFooter";

export {
  NodeCard,
  NodeCardHeader,
  NodeCardFooter,
  NodeCardDescription,
  NodeCardContent,
};
