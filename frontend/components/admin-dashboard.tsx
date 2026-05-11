import type { ApiKey, Node, NodeModel, Tenant } from "@/lib/admin-api";

type AdminDashboardProps = {
  tenants: Tenant[];
  nodes: Node[];
  apiKeys: ApiKey[];
  nodeModels: NodeModel[];
  backendReachable: boolean;
  backendUrl: string;
};

function formatDate(value: string | null): string {
  if (!value) return "Never";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function StatusPill({
  tone,
  children,
}: {
  tone: "good" | "warn" | "muted";
  children: React.ReactNode;
}) {
  return (
    <span className={`status-pill status-pill--${tone}`}>{children}</span>
  );
}

function SectionFrame({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section-frame">
      <div className="section-header">
        <p className="section-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function AdminDashboard({
  tenants,
  nodes,
  apiKeys,
  nodeModels,
  backendReachable,
  backendUrl,
}: AdminDashboardProps) {
  const metrics = [
    {
      label: "Tenants Under Watch",
      value: tenants.length,
      note: `${apiKeys.length} issued keys`,
    },
    {
      label: "Node Convoy",
      value: nodes.length,
      note: `${nodes.filter((node) => node.health_status === "ok").length} healthy`,
    },
    {
      label: "Public Routes",
      value: new Set(nodeModels.map((model) => model.public_model)).size,
      note: `${nodeModels.length} total mappings`,
    },
    {
      label: "Active Credentials",
      value: apiKeys.filter((apiKey) => apiKey.status === "active").length,
      note: `${apiKeys.length} total keys`,
    },
  ];

  return (
    <main className="ops-page">
      <div className="signal-grid" />

      <section className="hero-shell">
        <div className="hero-copy">
          <p className="hero-kicker">OpenTruck Dispatch Ledger</p>
          <h1>
            A dockside control room for tenants, keys, nodes, and routed models.
          </h1>
          <p className="hero-summary">
            This board treats your gateway like an operations floor, not a soft
            SaaS template. Warm paper tones, hard signal colors, and live admin
            data keep it feeling like real infrastructure.
          </p>
        </div>

        <aside className="hero-aside">
          <div className="stamp-card">
            <p className="stamp-label">Backend Status</p>
            {backendReachable ? (
              <StatusPill tone="good">Linked to live admin API</StatusPill>
            ) : (
              <StatusPill tone="warn">Backend unreachable</StatusPill>
            )}
            <p className="stamp-target">{backendUrl}</p>
            <p className="stamp-footnote">
              Server-side fetches read the current control plane directly. If
              this panel flips to warning, the rest of the dashboard is showing
              a graceful empty state rather than fake demo numbers.
            </p>
          </div>
        </aside>
      </section>

      <section className="metrics-rack">
        {metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.note}</span>
          </article>
        ))}
      </section>

      {!backendReachable ? (
        <section className="alert-banner">
          <p>Control plane data is currently unavailable.</p>
          <span>
            Start the backend on port `8000` or set `BACKEND_BASE_URL` for the
            frontend process.
          </span>
        </section>
      ) : null}

      <section className="ops-grid">
        <SectionFrame eyebrow="Tenant Registry" title="Quota carriers">
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Quota</th>
                  <th>RPM</th>
                  <th>TPM</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td>{tenant.name}</td>
                    <td>
                      <StatusPill
                        tone={tenant.status === "active" ? "good" : "muted"}
                      >
                        {tenant.status}
                      </StatusPill>
                    </td>
                    <td>{tenant.quota_balance}</td>
                    <td>{tenant.rate_limit_rpm}</td>
                    <td>{tenant.rate_limit_tpm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionFrame>

        <SectionFrame eyebrow="Node Convoy" title="Upstream machinery">
          <div className="stack-list">
            {nodes.map((node) => (
              <article key={node.id} className="stack-card">
                <div className="stack-row">
                  <h3>{node.name}</h3>
                  <StatusPill
                    tone={node.health_status === "ok" ? "good" : "warn"}
                  >
                    {node.health_status}
                  </StatusPill>
                </div>
                <p className="stack-url">{node.base_url}</p>
                <div className="stack-meta">
                  <span>{node.region}</span>
                  <span>weight {node.weight}</span>
                  <span>max {node.max_concurrency}</span>
                </div>
                <div className="tag-row">
                  {node.tags.map((tag) => (
                    <span key={`${node.id}-${tag}`} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame eyebrow="Key Issuance" title="Credential inventory">
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Tenant</th>
                  <th>Last Used</th>
                  <th>Fingerprint</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id}>
                    <td>{apiKey.name}</td>
                    <td>
                      <StatusPill
                        tone={apiKey.status === "active" ? "good" : "muted"}
                      >
                        {apiKey.status}
                      </StatusPill>
                    </td>
                    <td className="mono">{apiKey.tenant_id.slice(0, 8)}</td>
                    <td>{formatDate(apiKey.last_used_at)}</td>
                    <td className="mono">{apiKey.key_hash.slice(0, 12)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionFrame>

        <SectionFrame eyebrow="Routing Surface" title="Published model lanes">
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Public Model</th>
                  <th>External Model</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Input</th>
                  <th>Output</th>
                </tr>
              </thead>
              <tbody>
                {nodeModels.map((nodeModel) => (
                  <tr key={nodeModel.id}>
                    <td>{nodeModel.public_model}</td>
                    <td>{nodeModel.external_model}</td>
                    <td>
                      <StatusPill
                        tone={
                          nodeModel.status === "active" ? "good" : "muted"
                        }
                      >
                        {nodeModel.status}
                      </StatusPill>
                    </td>
                    <td>{nodeModel.priority}</td>
                    <td>{nodeModel.input_price}</td>
                    <td>{nodeModel.output_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionFrame>
      </section>
    </main>
  );
}
