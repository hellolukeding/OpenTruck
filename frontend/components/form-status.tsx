"use client";

import { cn } from "@/lib/utils";

type FormStatusProps = {
  status: "idle" | "success" | "error";
  message?: string;
};

export function FormStatus({ status, message }: FormStatusProps) {
  if (status === "idle" || !message) {
    return null;
  }

  return (
    <div
      className={cn(
        "border px-4 py-3 text-sm",
        status === "success"
          ? "border-outline-variant bg-surface-container text-primary"
          : "border-error bg-error-container text-on-error-container",
      )}
    >
      {message}
    </div>
  );
}
