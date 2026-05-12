"use server";

import { revalidatePath } from "next/cache";

const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL ?? "http://127.0.0.1:8000";

export type AdminActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  details?: Record<string, string>;
};

type ResourceKey = "tenants" | "nodes" | "api-keys" | "models" | "upstream-accounts";

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

async function patchAdmin(path: string, payload: unknown): Promise<Response> {
  return fetch(`${BACKEND_BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

async function deleteAdmin(path: string): Promise<Response> {
  return fetch(`${BACKEND_BASE_URL}${path}`, {
    method: "DELETE",
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
      revalidatePath(`/${locale}/upstream-accounts`);
    }

    if (resource === "nodes") {
      revalidatePath(`/${locale}/models`);
    }

    if (resource === "upstream-accounts") {
      revalidatePath(`/${locale}/upstream-accounts`);
    }
  }
}

async function postAdminAndParse<T>(path: string, payload: unknown): Promise<{ response: Response; data: T | null }> {
  const response = await postAdmin(path, payload);
  if (!response.ok) {
    return { response, data: null };
  }

  try {
    return { response, data: (await response.json()) as T };
  } catch {
    return { response, data: null };
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

export async function updateTenantAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const tenantId = String(formData.get("tenant_id") ?? "").trim();
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    status: String(formData.get("status") ?? "active"),
    quota_balance: String(formData.get("quota_balance") ?? "0"),
    rate_limit_rpm: Number(formData.get("rate_limit_rpm") ?? 60),
    rate_limit_tpm: Number(formData.get("rate_limit_tpm") ?? 120000),
  };

  const response = await patchAdmin(`/admin/tenants/${tenantId}`, payload);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("tenants");
  return { status: "success", message: "Tenant updated successfully." };
}

export async function deleteTenantAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const tenantId = String(formData.get("tenant_id") ?? "").trim();
  const response = await deleteAdmin(`/admin/tenants/${tenantId}`);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("tenants");
  return { status: "success", message: "Tenant deleted successfully." };
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

export async function updateNodeAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const nodeId = String(formData.get("node_id") ?? "").trim();
  const tagsValue = String(formData.get("tags") ?? "").trim();
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    base_url: String(formData.get("base_url") ?? "").trim(),
    auth_type: String(formData.get("auth_type") ?? "bearer"),
    region: String(formData.get("region") ?? "global").trim(),
    status: String(formData.get("status") ?? "active"),
    health_status: String(formData.get("health_status") ?? "unknown"),
    weight: Number(formData.get("weight") ?? 100),
    max_concurrency: Number(formData.get("max_concurrency") ?? 16),
    tags: tagsValue
      ? tagsValue.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [],
  };

  const response = await patchAdmin(`/admin/nodes/${nodeId}`, payload);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("nodes");
  return { status: "success", message: "Node updated successfully." };
}

export async function deleteNodeAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const nodeId = String(formData.get("node_id") ?? "").trim();
  const response = await deleteAdmin(`/admin/nodes/${nodeId}`);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("nodes");
  return { status: "success", message: "Node deleted successfully." };
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

export async function updateApiKeyAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const apiKeyId = String(formData.get("api_key_id") ?? "").trim();
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

  const rawKey = String(formData.get("raw_key") ?? "").trim();
  const payload: Record<string, unknown> = {
    name: String(formData.get("name") ?? "").trim(),
    status: String(formData.get("status") ?? "active"),
    scope,
  };

  if (rawKey) {
    payload.raw_key = rawKey;
  }

  const response = await patchAdmin(`/admin/api-keys/${apiKeyId}`, payload);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("api-keys");
  return { status: "success", message: "API key updated successfully." };
}

export async function deleteApiKeyAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const apiKeyId = String(formData.get("api_key_id") ?? "").trim();
  const response = await deleteAdmin(`/admin/api-keys/${apiKeyId}`);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("api-keys");
  return { status: "success", message: "API key deleted successfully." };
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

export async function updateNodeModelAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const nodeModelId = String(formData.get("node_model_id") ?? "").trim();
  const payload = {
    external_model: String(formData.get("external_model") ?? "").trim(),
    public_model: String(formData.get("public_model") ?? "").trim(),
    input_price: String(formData.get("input_price") ?? "0"),
    output_price: String(formData.get("output_price") ?? "0"),
    priority: Number(formData.get("priority") ?? 100),
    status: String(formData.get("status") ?? "active"),
  };

  const response = await patchAdmin(`/admin/node-models/${nodeModelId}`, payload);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("models");
  return { status: "success", message: "Model route updated successfully." };
}

export async function deleteNodeModelAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const nodeModelId = String(formData.get("node_model_id") ?? "").trim();
  const response = await deleteAdmin(`/admin/node-models/${nodeModelId}`);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("models");
  return { status: "success", message: "Model route deleted successfully." };
}

type OpenAIOAuthAuthUrlResponse = {
  session_id: string;
  auth_url: string;
  state: string;
  expires_at: string;
};

export async function generateOpenAIOAuthUrlAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const redirectUri = String(formData.get("redirect_uri") ?? "").trim();
  const proxyUrl = String(formData.get("proxy_url") ?? "").trim();
  const payload = {
    tenant_id: String(formData.get("tenant_id") ?? "").trim(),
    redirect_uri: redirectUri || null,
    proxy_url: proxyUrl || null,
    platform: "openai",
  };

  const { response, data } = await postAdminAndParse<OpenAIOAuthAuthUrlResponse>("/admin/openai/oauth/auth-url", payload);
  if (!response.ok || !data) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("upstream-accounts");
  return {
    status: "success",
    message: "OAuth authorization link created successfully.",
    details: {
      session_id: data.session_id,
      auth_url: data.auth_url,
      state: data.state,
      expires_at: data.expires_at,
    },
  };
}

export async function createUpstreamAccountFromOAuthAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const payload = {
    tenant_id: String(formData.get("tenant_id") ?? "").trim(),
    session_id: String(formData.get("session_id") ?? "").trim(),
    code: String(formData.get("code") ?? "").trim(),
    state: String(formData.get("state") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim() || null,
    status: String(formData.get("status") ?? "active"),
  };

  const response = await postAdmin("/admin/openai/oauth/create-account", payload);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("upstream-accounts");
  return { status: "success", message: "Upstream account connected successfully." };
}

export async function updateUpstreamAccountAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const accountId = String(formData.get("account_id") ?? "").trim();
  const tokenExpiresAt = String(formData.get("token_expires_at") ?? "").trim();
  const cooldownUntil = String(formData.get("cooldown_until") ?? "").trim();
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    status: String(formData.get("status") ?? "active"),
    priority: Number(formData.get("priority") ?? 100),
    token_expires_at: tokenExpiresAt || null,
    cooldown_until: cooldownUntil || null,
  };

  const response = await patchAdmin(`/admin/upstream-accounts/${accountId}`, payload);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("upstream-accounts");
  return { status: "success", message: "Upstream account updated successfully." };
}

export async function deleteUpstreamAccountAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const accountId = String(formData.get("account_id") ?? "").trim();
  const response = await deleteAdmin(`/admin/upstream-accounts/${accountId}`);
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("upstream-accounts");
  return { status: "success", message: "Upstream account deleted successfully." };
}

export async function refreshUpstreamAccountAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const accountId = String(formData.get("account_id") ?? "").trim();
  const response = await postAdmin(`/admin/upstream-accounts/${accountId}/refresh`, {});
  if (!response.ok) {
    return { status: "error", message: await parseError(response) };
  }

  revalidateAdminViews("upstream-accounts");
  return { status: "success", message: "Upstream account refreshed successfully." };
}
