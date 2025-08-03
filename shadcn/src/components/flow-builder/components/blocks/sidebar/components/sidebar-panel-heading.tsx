import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type SidebarPanelHeadingProps = Readonly<ComponentPropsWithoutRef<"div">>;

export default function SidebarPanelHeading({
  children,
  className,
  ...props
}: SidebarPanelHeadingProps) {
  return (
    <div
      className={cn(
        "flex items-center text-sm h-10 leading-none px-4 border-b border-t select-none shrink-0 border-card-foreground/10 bg-card/80 text-center text-card-foreground/60 gap-x-2 font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
