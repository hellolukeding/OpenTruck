"use server";

import { revalidatePath } from "next/cache";

import type { ConsoleActionState } from "@/lib/admin-console-actions";

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

export async function createPaymentOrderFromPlanAction(
  _prevState: ConsoleActionState,
  formData: FormData,
): Promise<ConsoleActionState> {
  const payload = {
    tenant_id: String(formData.get("tenant_id") ?? "").trim(),
    plan_id: String(formData.get("plan_id") ?? "").trim(),
    channel_id: String(formData.get("channel_id") ?? "").trim() || null,
    note: String(formData.get("note") ?? "").trim() || null,
  };

  const response = await fetch(`${BACKEND_BASE_URL}/admin/wallet/orders/from-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateConsoleViews();
  return { status: "success", message: "套餐订单已创建。" };
}

export async function updatePaymentOrderStatusAction(
  _prevState: ConsoleActionState,
  formData: FormData,
): Promise<ConsoleActionState> {
  const orderId = String(formData.get("order_id") ?? "").trim();
  const payload = {
    status: String(formData.get("status") ?? "").trim(),
    note: String(formData.get("note") ?? "").trim() || null,
    checkout_url: String(formData.get("checkout_url") ?? "").trim() || null,
  };

  const response = await fetch(`${BACKEND_BASE_URL}/admin/wallet/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateConsoleViews();
  return { status: "success", message: "订单状态已更新。" };
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
