"use server";

import { revalidatePath } from "next/cache";

export type ConsoleActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

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
    revalidatePath(`/${locale}/wallet`);
    revalidatePath(`/${locale}/logs`);
    revalidatePath(`/${locale}/tickets`);
  }
}

export async function createPaymentOrderAction(
  _prevState: ConsoleActionState,
  formData: FormData,
): Promise<ConsoleActionState> {
  const payload = {
    tenant_id: String(formData.get("tenant_id") ?? "").trim(),
    amount: String(formData.get("amount") ?? "").trim(),
    credited_amount: String(formData.get("credited_amount") ?? "").trim() || null,
    currency: "CNY",
    payment_provider: String(formData.get("payment_provider") ?? "").trim() || null,
    payment_channel: String(formData.get("payment_channel") ?? "").trim() || null,
    note: String(formData.get("note") ?? "").trim() || null,
  };

  const response = await fetch(`${BACKEND_BASE_URL}/admin/wallet/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateConsoleViews();
  return { status: "success", message: "充值单已创建。" };
}

export async function settlePaymentOrderAction(
  _prevState: ConsoleActionState,
  formData: FormData,
): Promise<ConsoleActionState> {
  const orderId = String(formData.get("order_id") ?? "").trim();
  const creditedAmount = String(formData.get("credited_amount") ?? "").trim() || null;
  const response = await fetch(`${BACKEND_BASE_URL}/admin/wallet/orders/${orderId}/settle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credited_amount: creditedAmount }),
    cache: "no-store",
  });
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateConsoleViews();
  return { status: "success", message: "充值单已入账。" };
}

export async function createSupportTicketAction(
  _prevState: ConsoleActionState,
  formData: FormData,
): Promise<ConsoleActionState> {
  const payload = {
    tenant_id: String(formData.get("tenant_id") ?? "").trim(),
    subject: String(formData.get("subject") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    priority: String(formData.get("priority") ?? "normal").trim(),
    contact_email: String(formData.get("contact_email") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
  };

  const response = await fetch(`${BACKEND_BASE_URL}/admin/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateConsoleViews();
  return { status: "success", message: "工单已提交。" };
}

export async function createPaymentPlanAction(
  _prevState: ConsoleActionState,
  formData: FormData,
): Promise<ConsoleActionState> {
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    status: "active",
    price_amount: String(formData.get("price_amount") ?? "").trim(),
    credit_amount: String(formData.get("credit_amount") ?? "").trim(),
    currency: "CNY",
    quota_units: Number(formData.get("quota_units") ?? 0),
    badge_text: String(formData.get("badge_text") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 100),
    is_featured: String(formData.get("is_featured") ?? "") === "on",
    description: String(formData.get("description") ?? "").trim() || null,
  };

  const response = await fetch(`${BACKEND_BASE_URL}/admin/payment-plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateConsoleViews();
  return { status: "success", message: "套餐已创建。" };
}

export async function createPaymentChannelAction(
  _prevState: ConsoleActionState,
  formData: FormData,
): Promise<ConsoleActionState> {
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    provider: String(formData.get("provider") ?? "").trim(),
    channel_code: String(formData.get("channel_code") ?? "").trim(),
    status: "active",
    sort_order: Number(formData.get("sort_order") ?? 100),
    is_recommended: String(formData.get("is_recommended") ?? "") === "on",
    description: String(formData.get("description") ?? "").trim() || null,
  };

  const response = await fetch(`${BACKEND_BASE_URL}/admin/payment-channels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateConsoleViews();
  return { status: "success", message: "支付渠道已创建。" };
}

export async function updatePaymentPlanAction(
  _prevState: ConsoleActionState,
  formData: FormData,
): Promise<ConsoleActionState> {
  const planId = String(formData.get("plan_id") ?? "").trim();
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    status: String(formData.get("status") ?? "active").trim(),
    price_amount: String(formData.get("price_amount") ?? "").trim(),
    credit_amount: String(formData.get("credit_amount") ?? "").trim(),
    quota_units: Number(formData.get("quota_units") ?? 0),
    badge_text: String(formData.get("badge_text") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 100),
    is_featured: String(formData.get("is_featured") ?? "") === "on",
    description: String(formData.get("description") ?? "").trim() || null,
  };

  const response = await fetch(`${BACKEND_BASE_URL}/admin/payment-plans/${planId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateConsoleViews();
  return { status: "success", message: "套餐已更新。" };
}

export async function deletePaymentPlanAction(
  _prevState: ConsoleActionState,
  formData: FormData,
): Promise<ConsoleActionState> {
  const planId = String(formData.get("plan_id") ?? "").trim();
  const response = await fetch(`${BACKEND_BASE_URL}/admin/payment-plans/${planId}`, {
    method: "DELETE",
    cache: "no-store",
  });
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateConsoleViews();
  return { status: "success", message: "套餐已删除。" };
}

export async function updatePaymentChannelAction(
  _prevState: ConsoleActionState,
  formData: FormData,
): Promise<ConsoleActionState> {
  const channelId = String(formData.get("channel_id") ?? "").trim();
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    provider: String(formData.get("provider") ?? "").trim(),
    channel_code: String(formData.get("channel_code") ?? "").trim(),
    status: String(formData.get("status") ?? "active").trim(),
    sort_order: Number(formData.get("sort_order") ?? 100),
    is_recommended: String(formData.get("is_recommended") ?? "") === "on",
    description: String(formData.get("description") ?? "").trim() || null,
  };

  const response = await fetch(`${BACKEND_BASE_URL}/admin/payment-channels/${channelId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateConsoleViews();
  return { status: "success", message: "支付渠道已更新。" };
}

export async function deletePaymentChannelAction(
  _prevState: ConsoleActionState,
  formData: FormData,
): Promise<ConsoleActionState> {
  const channelId = String(formData.get("channel_id") ?? "").trim();
  const response = await fetch(`${BACKEND_BASE_URL}/admin/payment-channels/${channelId}`, {
    method: "DELETE",
    cache: "no-store",
  });
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateConsoleViews();
  return { status: "success", message: "支付渠道已删除。" };
}
