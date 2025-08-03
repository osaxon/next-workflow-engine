import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type SidebarButtonItemProps = Readonly<
  ComponentPropsWithoutRef<"button"> & {
    active?: boolean;
  }
>;

export default function SidebarButtonItem({
  children,
  className,
  active,
  ...props
}: SidebarButtonItemProps) {
  return (
    <Button
      size={"icon"}
      type="button"
      variant={active ? "default" : "ghost"}
      className={cn(
        "size-8 flex items-center justify-center",

        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
