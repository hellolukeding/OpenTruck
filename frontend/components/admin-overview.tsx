import { Bolt, KeyRound, RadioTower, Route, Store } from "lucide-react";

import type { ApiKey, Node, NodeModel, Tenant } from "@/lib/admin-api";
import type { DashboardDictionary } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";

type AdminOverviewProps = {
  tenants: Tenant[];
  nodes: Node[];
  apiKeys: ApiKey[];
  nodeModels: NodeModel[];
  dictionary: DashboardDictionary;
};

function statusVariant(status: string): "default" | "secondary" | "success" | "warning" {
  const normalized = status.toLowerCase();
  if (normalized === "active" || normalized === "ok") return "success";
  if (normalized === "unknown" || normalized === "degraded") return "warning";
  return "secondary";
}

export function AdminOverview({
  tenants,
  nodes,
  apiKeys,
  nodeModels,
  dictionary,
}: AdminOverviewProps) {
  const publishedModels = Array.from(new Set(nodeModels.map((item) => item.public_model)));
  const activeKeys = apiKeys.filter((item) => item.status === "active");
  const healthyNodes = nodes.filter((item) => item.health_status === "ok");

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[24px] border border-outline-variant/30 bg-primary-container text-on-primary-container shadow-sm dark:bg-primary">
        <div className="flex flex-col gap-5 p-6 md:flex-row md:items-start md:justify-between md:p-8">
          <div>
            <div className="flex items-center gap-3">
              <Bolt className="h-10 w-10" />
              <h1 className="text-[2.6rem] font-semibold tracking-[-0.06em]">OpenTruck</h1>
            </div>
            <p className="mt-4 max-w-[30rem] text-[1rem] leading-7 opacity-90">
              {dictionary.overview.signalSummary}
            </p>
          </div>
          <a
            href="#overview-keys"
            className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-3 text-[0.9rem] font-medium transition-colors hover:bg-white/30"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create OpenTruck Key
          </a>
        </div>
        <div className="grid grid-cols-3 border-t border-white/20">
          {[
            { label: "API Keys", value: apiKeys.length },
            { label: dictionary.status.active, value: activeKeys.length },
            { label: "Published Models", value: publishedModels.length },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`p-6 text-center ${index < 2 ? "border-r border-white/20" : ""}`}
            >
              <p className="text-[0.76rem] uppercase tracking-[0.18em] opacity-75">
                {item.label}
              </p>
              <p className="mt-2 text-[3.1rem] font-semibold leading-none">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <OverviewSection
        id="overview-keys"
        icon={<KeyRound className="h-5 w-5 text-primary" />}
        title="OpenTruck Keys"
        actionLabel="New"
      >
        {apiKeys.length > 0 ? (
          apiKeys.slice(0, 3).map((apiKey) => (
            <div
              key={apiKey.id}
              className="rounded-[20px] border border-outline-variant/20 bg-surface px-5 py-5 shadow-sm dark:bg-surface-container-low"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[2rem] font-semibold tracking-[-0.05em] text-on-surface">
                      {apiKey.name}
                    </span>
                    <Badge variant={statusVariant(apiKey.status)}>{apiKey.status}</Badge>
                    <span className="text-[0.88rem] text-on-surface-variant">
                      tenant {apiKey.tenant_id.slice(0, 8)}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.95rem] text-on-surface-variant">
                    {formatScope(apiKey.scope)}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 dark:bg-surface-container">
                <code className="font-code-sm text-[0.86rem] text-on-surface">
                  {apiKey.key_hash.slice(0, 16)}...
                </code>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyPanel label="No API keys issued yet." />
        )}
      </OverviewSection>

      <OverviewSection
        icon={<Store className="h-5 w-5 text-primary" />}
        title={`Connected Tenants ${tenants.length}`}
        actionLabel="Manage"
      >
        <div className="flex flex-wrap gap-4">
          {tenants.length > 0 ? (
            tenants.slice(0, 6).map((tenant) => (
              <div
                key={tenant.id}
                className="inline-flex min-w-[15rem] items-center gap-4 rounded-[18px] border border-outline-variant/20 bg-surface-container-low px-4 py-4 dark:bg-surface-container"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-high text-[0.92rem] font-semibold text-primary">
                  {tenant.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-[1rem] font-medium text-on-surface">{tenant.name}</p>
                  <p className="text-[0.84rem] text-on-surface-variant">
                    quota {formatQuota(tenant.quota_balance)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <EmptyPanel label="No tenants configured yet." />
          )}
        </div>
      </OverviewSection>

      <OverviewSection icon={<Route className="h-5 w-5 text-primary" />} title={`Published Models ${publishedModels.length}`}>
        <div className="overflow-hidden rounded-[20px] border border-outline-variant/20">
          <div className="grid grid-cols-[1.2fr_1fr_0.8fr] bg-surface-container-low px-5 py-3 text-[0.76rem] uppercase tracking-[0.12em] text-on-surface-variant">
            <span>Model Name</span>
            <span className="text-right">Routing Target</span>
            <span className="text-right">Nodes</span>
          </div>
          {publishedModels.length > 0 ? (
            publishedModels.map((publicModel) => {
              const matches = nodeModels.filter((item) => item.public_model === publicModel);
              return (
                <div
                  key={publicModel}
                  className="grid grid-cols-[1.2fr_1fr_0.8fr] items-center border-t border-outline-variant/10 bg-surface-container-lowest px-5 py-4 text-[0.95rem] dark:bg-surface-container-low/70"
                >
                  <span className="font-medium text-on-surface">{publicModel}</span>
                  <span className="text-right text-primary">
                    {matches[0]?.external_model ?? "Mapped"}
                  </span>
                  <span className="text-right text-on-surface-variant">{matches.length}</span>
                </div>
              );
            })
          ) : (
            <EmptyPanel label="No model routes published yet." />
          )}
        </div>
      </OverviewSection>

      <section className="grid gap-6 lg:grid-cols-2">
        <SignalCard
          icon={<RadioTower className="h-5 w-5 text-primary" />}
          title="Node Health"
          value={`${healthyNodes.length}/${nodes.length || 0}`}
          note={dictionary.metrics.healthyNodes(healthyNodes.length)}
        />
        <SignalCard
          icon={<Bolt className="h-5 w-5 text-primary" />}
          title="Control Surface"
          value={dictionary.overview.signalTitle}
          note={dictionary.heroSummary}
        />
      </section>
    </div>
  );
}

function formatScope(scope: Record<string, unknown>) {
  const keys = Object.keys(scope);
  if (keys.length === 0) {
    return "Default scope";
  }
  return keys.join(", ");
}

function formatQuota(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : value;
}

function OverviewSection({
  id,
  icon,
  title,
  actionLabel,
  children,
}: {
  id?: string;
  icon: React.ReactNode;
  title: string;
  actionLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="overflow-hidden rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest shadow-sm dark:bg-surface-container-low/50"
    >
      <div className="flex items-center justify-between border-b border-outline-variant/10 px-6 py-5">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-[2rem] font-semibold tracking-[-0.05em] text-on-surface">
            {title}
          </h2>
        </div>
        {actionLabel ? (
          <button className="rounded-xl border border-outline-variant/30 px-4 py-2 text-[0.9rem] transition-colors hover:bg-surface-container-low">
            {actionLabel}
          </button>
        ) : null}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function SignalCard({
  icon,
  title,
  value,
  note,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm dark:bg-surface-container-low/50">
      <div className="flex items-center gap-3">{icon}<span className="text-[1rem] font-medium">{title}</span></div>
      <p className="mt-4 text-[1.6rem] font-semibold tracking-[-0.04em] text-on-surface">{value}</p>
      <p className="mt-3 text-[0.9rem] leading-7 text-on-surface-variant">{note}</p>
    </div>
  );
}

function EmptyPanel({ label }: { label: string }) {
  return (
    <div className="rounded-[18px] border border-dashed border-outline-variant/30 bg-surface-container-low px-5 py-8 text-center text-[0.92rem] text-on-surface-variant dark:bg-surface-container">
      {label}
    </div>
  );
}
