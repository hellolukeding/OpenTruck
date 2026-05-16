"use client";

export function StatusPill({ children, tone }: { children: string; tone: "success" | "neutral" }) {
  return (
    <span
      className={`rounded px-sm py-xs text-label-md ${
        tone === "success" ? "bg-emerald-100 text-emerald-600" : "bg-surface-container text-on-surface-variant"
      }`}
    >
      {children}
    </span>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <div className="rounded-xl bg-surface px-lg py-xl text-body-md text-on-surface-variant">{text}</div>;
}

export function formatMerchantDate(locale: string, value: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
