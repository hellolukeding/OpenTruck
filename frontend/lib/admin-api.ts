export type Tenant = {
  id: string;
  name: string;
  status: string;
  quota_balance: string;
  rate_limit_rpm: number;
  rate_limit_tpm: number;
  created_at: string;
  updated_at: string;
};

export type Node = {
  id: string;
  name: string;
  base_url: string;
  auth_type: string;
  auth_config: Record<string, unknown>;
  region: string;
  status: string;
  health_status: string;
  weight: number;
  max_concurrency: number;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type ApiKey = {
  id: string;
  tenant_id: string;
  name: string;
  key_hash: string;
  status: string;
  scope: Record<string, unknown>;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
};

export type NodeModel = {
  id: string;
  node_id: string;
  external_model: string;
  public_model: string;
  input_price: string;
  output_price: string;
  priority: number;
  status: string;
  created_at: string;
  updated_at: string;
};

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

export type AdminOverview = {
  tenants: Tenant[];
  nodes: Node[];
  apiKeys: ApiKey[];
  nodeModels: NodeModel[];
  backendReachable: boolean;
  backendUrl: string;
};

export type ResourceQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  region?: string;
  healthStatus?: string;
  tenantId?: string;
  nodeId?: string;
  publicModel?: string;
};

const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL ?? "http://127.0.0.1:8000";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  return (await response.json()) as T;
}

function unwrapList<T>(payload: T[] | PaginatedResponse<T>): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload.items;
}

function buildResourceUrl(path: string, query: ResourceQuery = {}): string {
  const searchParams = new URLSearchParams();

  if (query.page) searchParams.set("page", String(query.page));
  if (query.pageSize) searchParams.set("page_size", String(query.pageSize));
  if (query.search) searchParams.set("search", query.search);
  if (query.status) searchParams.set("status", query.status);
  if (query.sortBy) searchParams.set("sort_by", query.sortBy);
  if (query.sortOrder) searchParams.set("sort_order", query.sortOrder);
  if (query.region) searchParams.set("region", query.region);
  if (query.healthStatus) searchParams.set("health_status", query.healthStatus);
  if (query.tenantId) searchParams.set("tenant_id", query.tenantId);
  if (query.nodeId) searchParams.set("node_id", query.nodeId);
  if (query.publicModel) searchParams.set("public_model", query.publicModel);

  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

async function fetchPaginated<T>(
  path: string,
  query: ResourceQuery = {},
): Promise<PaginatedResponse<T>> {
  const payload = await fetchJson<T[] | PaginatedResponse<T>>(buildResourceUrl(path, query));

  if (Array.isArray(payload)) {
    const pageSize = query.pageSize ?? payload.length;
    return {
      items: payload,
      pagination: {
        total: payload.length,
        page: query.page ?? 1,
        page_size: pageSize,
        total_pages: pageSize > 0 ? Math.max(1, Math.ceil(payload.length / pageSize)) : 1,
      },
    };
  }

  return payload;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  try {
    const [tenantsPayload, nodesPayload, apiKeysPayload, nodeModelsPayload] = await Promise.all([
      fetchJson<Tenant[] | PaginatedResponse<Tenant>>("/admin/tenants"),
      fetchJson<Node[] | PaginatedResponse<Node>>("/admin/nodes"),
      fetchJson<ApiKey[] | PaginatedResponse<ApiKey>>("/admin/api-keys"),
      fetchJson<NodeModel[] | PaginatedResponse<NodeModel>>("/admin/node-models"),
    ]);

    return {
      tenants: unwrapList(tenantsPayload),
      nodes: unwrapList(nodesPayload),
      apiKeys: unwrapList(apiKeysPayload),
      nodeModels: unwrapList(nodeModelsPayload),
      backendReachable: true,
      backendUrl: BACKEND_BASE_URL,
    };
  } catch {
    return {
      tenants: [],
      nodes: [],
      apiKeys: [],
      nodeModels: [],
      backendReachable: false,
      backendUrl: BACKEND_BASE_URL,
    };
  }
}

export async function getTenantsPage(query: ResourceQuery = {}) {
  return fetchPaginated<Tenant>("/admin/tenants", query);
}

export async function getNodesPage(query: ResourceQuery = {}) {
  return fetchPaginated<Node>("/admin/nodes", query);
}

export async function getApiKeysPage(query: ResourceQuery = {}) {
  return fetchPaginated<ApiKey>("/admin/api-keys", query);
}

export async function getNodeModelsPage(query: ResourceQuery = {}) {
  return fetchPaginated<NodeModel>("/admin/node-models", query);
}
