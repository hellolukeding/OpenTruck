"use server";

import { revalidatePath } from "next/cache";

import type { ConsoleActionState } from "@/lib/admin-console-actions";
import { getAnnouncementsPageCopy } from "@/lib/announcements-page-copy";
import { isSupportedLocale, type Locale } from "@/lib/i18n";

type ErrorPayload = {
  error?: {
    message?: string;
  };
};

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL ?? "http://127.0.0.1:8000";

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as ErrorPayload;
    return payload.error?.message ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

function revalidateConsoleViews() {
  for (const locale of ["en", "zh-CN"]) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/announcements`);
  }
}

function parseLocale(formData: FormData): Locale {
  const locale = String(formData.get("locale") ?? "en").trim();
  return isSupportedLocale(locale) ? locale : "en";
}

export async function createAnnouncementAction(
  _prevState: ConsoleActionState,
  formData: FormData,
): Promise<ConsoleActionState> {
  const copy = getAnnouncementsPageCopy(parseLocale(formData));
  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    status: String(formData.get("status") ?? "published").trim(),
    severity: String(formData.get("severity") ?? "info").trim(),
    sort_order: Number(formData.get("sort_order") ?? 100),
    is_pinned: String(formData.get("is_pinned") ?? "") === "on",
  };
  const response = await fetch(`${BACKEND_BASE_URL}/admin/announcements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) return { status: "error", message: await parseError(response) };
  revalidateConsoleViews();
  return { status: "success", message: copy.actions.created };
}

export async function updateAnnouncementAction(
  _prevState: ConsoleActionState,
  formData: FormData,
): Promise<ConsoleActionState> {
  const copy = getAnnouncementsPageCopy(parseLocale(formData));
  const id = String(formData.get("announcement_id") ?? "").trim();
  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    status: String(formData.get("status") ?? "published").trim(),
    severity: String(formData.get("severity") ?? "info").trim(),
    sort_order: Number(formData.get("sort_order") ?? 100),
    is_pinned: String(formData.get("is_pinned") ?? "") === "on",
  };
  const response = await fetch(`${BACKEND_BASE_URL}/admin/announcements/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) return { status: "error", message: await parseError(response) };
  revalidateConsoleViews();
  return { status: "success", message: copy.actions.updated };
}

export async function deleteAnnouncementAction(
  _prevState: ConsoleActionState,
  formData: FormData,
): Promise<ConsoleActionState> {
  const copy = getAnnouncementsPageCopy(parseLocale(formData));
  const id = String(formData.get("announcement_id") ?? "").trim();
  const response = await fetch(`${BACKEND_BASE_URL}/admin/announcements/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
  if (!response.ok) return { status: "error", message: await parseError(response) };
  revalidateConsoleViews();
  return { status: "success", message: copy.actions.deleted };
}
