import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type CustomControlButtonProps = Readonly<ComponentPropsWithoutRef<"button">>;

export default function CustomControlButton({
  children,
  className,
  ...props
}: CustomControlButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "border-none flex disabled:text-card-foreground/10 text-card-foreground/60 hover:text-card disabled:cursor-not-allowed disabled:pointer-events-none items-center justify-center bg-transparent size-7  rounded-md transition active:bg-card-foreground/60 hover:bg-card-foreground/60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
