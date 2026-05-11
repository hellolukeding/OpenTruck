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

export type AdminOverview = {
  tenants: Tenant[];
  nodes: Node[];
  apiKeys: ApiKey[];
  nodeModels: NodeModel[];
  backendReachable: boolean;
  backendUrl: string;
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

export async function getAdminOverview(): Promise<AdminOverview> {
  try {
    const [tenants, nodes, apiKeys, nodeModels] = await Promise.all([
      fetchJson<Tenant[]>("/admin/tenants"),
      fetchJson<Node[]>("/admin/nodes"),
      fetchJson<ApiKey[]>("/admin/api-keys"),
      fetchJson<NodeModel[]>("/admin/node-models"),
    ]);

    return {
      tenants,
      nodes,
      apiKeys,
      nodeModels,
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
