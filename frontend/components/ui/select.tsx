import * as React from "react";

import { cn } from "@/lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full bg-surface border border-outline-variant text-body-md font-body-md text-on-surface px-md py-sm rounded-none focus:outline-none focus:border-primary focus:ring-0 transition-colors",
        className,
      )}
      {...props}
    />
  );
});
Select.displayName = "Select";

export { Select };
