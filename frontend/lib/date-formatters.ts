/**
 * Shared date formatting utilities for the frontend
 */

/**
 * Convert ISO date string to datetime-local input format (YYYY-MM-DDTHH:mm)
 */
export function toDateTimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const pad = (input: number) => String(input).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Format ISO date string for display with locale support
 */
export function formatDateTime(
  value: string | null,
  locale: "en" | "zh-CN",
  fallback: string = "-"
): string {
  if (!value) return fallback;

  try {
    return new Intl.DateTimeFormat(locale === "zh-CN" ? "zh-CN" : "en", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return fallback;
  }
}

/**
 * Format short datetime (no year) for compact display
 */
export function formatDateTimeShort(
  value: string,
  locale: "en" | "zh-CN"
): string {
  try {
    return new Intl.DateTimeFormat(locale === "zh-CN" ? "zh-CN" : "en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

/**
 * Format extra field value with fallback for null/undefined/empty
 */
export function formatExtraValue(value: unknown, fallback: string = "-"): string {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
