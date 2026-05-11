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
        "rounded-[1rem] border px-4 py-3 text-sm",
        status === "success"
          ? "border-emerald-600/20 bg-emerald-50 text-emerald-900"
          : "border-red-600/20 bg-red-50 text-red-900",
      )}
    >
      {message}
    </div>
  );
}
