"use server";

import { revalidatePath } from "next/cache";

const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL ?? "http://127.0.0.1:8000";

export type AdminActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

type ResourceKey = "tenants" | "nodes" | "api-keys" | "models";

type ErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
};

async function parseError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ErrorPayload;
    return payload.error?.message ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

async function postAdmin(path: string, payload: unknown): Promise<Response> {
  return fetch(`${BACKEND_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

function revalidateAdminViews(resource: ResourceKey) {
  const locales = ["en", "zh-CN"];

  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/${resource}`);

    if (resource === "tenants") {
      revalidatePath(`/${locale}/api-keys`);
    }

    if (resource === "nodes") {
      revalidatePath(`/${locale}/models`);
    }
  }
}

export async function createTenantAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    status: String(formData.get("status") ?? "active"),
    quota_balance: String(formData.get("quota_balance") ?? "0"),
    rate_limit_rpm: Number(formData.get("rate_limit_rpm") ?? 60),
    rate_limit_tpm: Number(formData.get("rate_limit_tpm") ?? 120000),
  };

  const response = await postAdmin("/admin/tenants", payload);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("tenants");
  return { status: "success", message: "Tenant created successfully." };
}

export async function createNodeAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const tagsValue = String(formData.get("tags") ?? "").trim();
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    base_url: String(formData.get("base_url") ?? "").trim(),
    auth_type: String(formData.get("auth_type") ?? "bearer"),
    auth_config: {},
    region: String(formData.get("region") ?? "global").trim(),
    status: String(formData.get("status") ?? "active"),
    health_status: String(formData.get("health_status") ?? "unknown"),
    weight: Number(formData.get("weight") ?? 100),
    max_concurrency: Number(formData.get("max_concurrency") ?? 16),
    tags: tagsValue
      ? tagsValue.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [],
  };

  const response = await postAdmin("/admin/nodes", payload);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("nodes");
  return { status: "success", message: "Node created successfully." };
}

export async function createApiKeyAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const scopeText = String(formData.get("scope") ?? "{}").trim() || "{}";
  let scope: Record<string, unknown>;

  try {
    scope = JSON.parse(scopeText) as Record<string, unknown>;
  } catch {
    return {
      status: "error",
      message: "Scope must be valid JSON.",
    };
  }

  const payload = {
    tenant_id: String(formData.get("tenant_id") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    raw_key: String(formData.get("raw_key") ?? "").trim(),
    status: String(formData.get("status") ?? "active"),
    scope,
  };

  const response = await postAdmin("/admin/api-keys", payload);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("api-keys");
  return { status: "success", message: "API key created successfully." };
}

export async function createNodeModelAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const payload = {
    node_id: String(formData.get("node_id") ?? "").trim(),
    external_model: String(formData.get("external_model") ?? "").trim(),
    public_model: String(formData.get("public_model") ?? "").trim(),
    input_price: String(formData.get("input_price") ?? "0"),
    output_price: String(formData.get("output_price") ?? "0"),
    priority: Number(formData.get("priority") ?? 100),
    status: String(formData.get("status") ?? "active"),
  };

  const response = await postAdmin("/admin/node-models", payload);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("models");
  return { status: "success", message: "Model route created successfully." };
}
