import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-2 py-0.5 text-code-sm font-code-sm border rounded-md",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-on-primary",
        secondary: "border-outline-variant bg-surface-container-high text-on-surface",
        success: "border-outline-variant bg-surface-container text-primary",
        warning: "border-tertiary-fixed-dim bg-tertiary-fixed-dim text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
