import { cn } from "@/lib/utils";

import type { ComponentPropsWithoutRef } from "react";

type SidebarPanelWrapperProps = Readonly<ComponentPropsWithoutRef<"div">>;

export default function SidebarPanelWrapper({
  children,
  className,
  ...props
}: SidebarPanelWrapperProps) {
  return (
    <div
      className={cn("flex flex-col w-80 h-full  bg-background/60", className)}
      {...props}
    >
      {children}
    </div>
  );
}
