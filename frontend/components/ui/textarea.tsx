import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full bg-surface border border-outline-variant text-body-md font-body-md text-on-surface px-md py-sm rounded-lg focus:outline-none focus:border-primary focus:ring-0 transition-colors placeholder:text-on-surface-variant resize-y",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
