export type PaginationMeta = {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export type DashboardMetric = {
  label: string;
  value: string | number;
};

export type DashboardUsagePoint = {
  bucket: string;
  requests: number;
  spend: string;
};

export type DashboardOverviewData = {
  tenant_count: number;
  active_api_keys: number;
  active_upstream_accounts: number;
  published_models: number;
  total_balance: string;
  recent_failed_requests: number;
  metrics: DashboardMetric[];
  usage_trend: DashboardUsagePoint[];
};

export type WalletLedgerEntry = {
  id: string;
  tenant_id: string;
  payment_order_id: string | null;
  entry_type: string;
  direction: string;
  amount: string;
  balance_after: string;
  currency: string;
  description: string;
  reference_type: string | null;
  reference_id: string | null;
  created_at: string;
};

export type PaymentOrder = {
  id: string;
  tenant_id: string;
  order_number: string;
  status: string;
  amount: string;
  credited_amount: string;
  currency: string;
  payment_provider: string | null;
  payment_channel: string | null;
  checkout_url: string | null;
  note: string | null;
  paid_at: string | null;
  created_at: string;
};

export type PaymentPlan = {
  id: string;
  name: string;
  status: string;
  price_amount: string;
  credit_amount: string;
  currency: string;
  quota_units: number;
  badge_text: string | null;
  sort_order: number;
  is_featured: boolean;
  description: string | null;
};

export type PaymentChannel = {
  id: string;
  name: string;
  provider: string;
  channel_code: string;
  status: string;
  sort_order: number;
  is_recommended: boolean;
  description: string | null;
};

export type WalletOverviewData = {
  tenant_id: string;
  tenant_name: string;
  balance: string;
  total_spent: string;
  total_recharged: string;
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  recent_orders: PaymentOrder[];
  recent_entries: WalletLedgerEntry[];
  payment_plans: PaymentPlan[];
  payment_channels: PaymentChannel[];
};

export type GatewayUsageLog = {
  id: string;
  tenant_id: string;
  tenant_name: string | null;
  api_key_id: string;
  api_key_name: string | null;
  upstream_account_id: string | null;
  upstream_account_name: string | null;
  request_kind: string;
  endpoint: string;
  status: string;
  model: string | null;
  response_id: string | null;
  conversation_id: string | null;
  upstream_status_code: number | null;
  error_code: string | null;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  quota_delta: string;
  created_at: string;
};

export type SupportTicket = {
  id: string;
  tenant_id: string;
  ticket_number: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  contact_email: string;
  description: string;
  latest_reply_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

type ConsoleQuery = {
  tenantId?: string;
  apiKeyId?: string;
  requestKind?: string;
  status?: string;
  model?: string;
  responseId?: string;
  priority?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL ?? "http://127.0.0.1:8000";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BACKEND_BASE_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }
  return (await response.json()) as T;
}

function buildUrl(path: string, query: ConsoleQuery = {}) {
  const params = new URLSearchParams();
  if (query.tenantId) params.set("tenant_id", query.tenantId);
  if (query.apiKeyId) params.set("api_key_id", query.apiKeyId);
  if (query.requestKind) params.set("request_kind", query.requestKind);
  if (query.status) params.set("status", query.status);
  if (query.model) params.set("model", query.model);
  if (query.responseId) params.set("response_id", query.responseId);
  if (query.priority) params.set("priority", query.priority);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("page_size", String(query.pageSize));
  const text = params.toString();
  return text ? `${path}?${text}` : path;
}

export async function getDashboardOverview() {
  return fetchJson<DashboardOverviewData>("/admin/dashboard");
}

export async function getWalletOverview(tenantId?: string) {
  return fetchJson<WalletOverviewData>(buildUrl("/admin/wallet", { tenantId }));
}

export async function getGatewayLogsPage(query: ConsoleQuery = {}) {
  return fetchJson<PaginatedResponse<GatewayUsageLog>>(buildUrl("/admin/logs", query));
}

export async function getSupportTicketsPage(query: ConsoleQuery = {}) {
  return fetchJson<PaginatedResponse<SupportTicket>>(buildUrl("/admin/tickets", query));
}
