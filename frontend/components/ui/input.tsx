import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full bg-surface border border-outline-variant text-body-md font-body-md text-on-surface px-md py-sm rounded-lg focus:outline-none focus:border-primary focus:ring-0 transition-colors placeholder:text-on-surface-variant",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
