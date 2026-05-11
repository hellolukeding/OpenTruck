import * as React from "react";

import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("font-label-md text-label-md text-on-surface", className)}
      {...props}
    />
  );
}

export { Label };
