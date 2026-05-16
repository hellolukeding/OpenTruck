import { notFound } from "next/navigation";

import { DeveloperApiKeys, DeveloperTopModels } from "@/components/developer-analytics";
import { DeveloperStats, DeveloperUsageChart } from "@/components/developer-dashboard";
import { DeveloperFooter } from "@/components/developer-footer";
import { DeveloperSidebar } from "@/components/developer-sidebar";
import { getDashboardOverview, getGatewayLogsPage, getWalletOverview } from "@/lib/admin-console-api";
import { getAdminOverview, getApiKeysPage, getNodeModelsPage } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

export default async function DeveloperPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  getDictionary(typedLocale);
  const overview = await getAdminOverview();
  const tenant = overview.tenants[0] ?? null;

  const [dashboard, wallet, apiKeysPage, logsPage, nodeModelsPage] = await Promise.all([
    getDashboardOverview().catch(() => null),
    tenant ? getWalletOverview(tenant.id).catch(() => null) : Promise.resolve(null),
    getApiKeysPage({
      tenantId: tenant?.id,
      pageSize: 5,
      sortBy: "last_used_at",
      sortOrder: "desc",
    }).catch(() => null),
    getGatewayLogsPage({
      tenantId: tenant?.id,
      pageSize: 100,
      sortBy: "created_at",
      sortOrder: "desc",
    }).catch(() => null),
    getNodeModelsPage({ pageSize: 100, sortBy: "priority", sortOrder: "asc" }).catch(() => null),
  ]);

  const stats = buildStats(dashboard, wallet);
  const chart = buildUsageChart(dashboard);
  const keys = (apiKeysPage?.items ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    fingerprint: `${item.key_hash.slice(0, 6)}...${item.key_hash.slice(-4)}`,
    lastUsed: item.last_used_at ? formatRelative(item.last_used_at) : "Never",
    status: item.status,
  }));
  const topModels = buildTopModels(logsPage?.items ?? [], nodeModelsPage?.items ?? []);

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      <DeveloperSidebar
        locale={typedLocale}
        tenantName={tenant?.name ?? "Developer Tenant"}
        planLabel={wallet ? `余额 ${formatMoney(wallet.balance)}` : "等待数据"}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-outline-variant/30 h-16 px-gutter flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="md:hidden flex items-center gap-2">
              <span className="material-symbols-outlined text-primary font-bold">terminal</span>
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">search</span>
              <input
                className="pl-10 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-64 md:w-96 transition-all"
                placeholder="Search usage, keys, or endpoints..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-md">
            <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-all active:scale-95">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Generate New Key</span>
            </button>
          </div>
        </header>

        <div className="p-gutter md:p-margin max-w-max-width mx-auto w-full space-y-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-headline-md text-headline-md text-on-surface">Overview</h2>
                <div className="flex items-center gap-2 bg-primary-container/10 px-2 py-0.5 rounded border border-primary-container/20">
                  <div className="pulse-dot" />
                  <span className="font-label-md text-label-md text-primary">Live Systems</span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-secondary-container">
                Monitor your API usage, balance consumption, and model traffic with real tenant data.
              </p>
            </div>
            <div className="flex gap-sm">
              <button className="px-4 py-2 bg-white border border-outline-variant text-on-surface rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container-high transition-all">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Last 7 Days
              </button>
              <button className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-surface-tint shadow-sm transition-all active:scale-95">
                <span className="material-symbols-outlined text-[18px]">vpn_key</span>
                Generate New Key
              </button>
            </div>
          </div>

          <DeveloperStats cards={stats} />
          <DeveloperUsageChart points={chart} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            <DeveloperApiKeys keys={keys} />
            <DeveloperTopModels models={topModels} />
          </div>

          <DeveloperFooter />
        </div>
      </main>
    </div>
  );
}

function buildStats(
  dashboard: Awaited<ReturnType<typeof getDashboardOverview>> | null,
  wallet: Awaited<ReturnType<typeof getWalletOverview>> | null,
) {
  const recentRequests = dashboard?.usage_trend.reduce((sum, item) => sum + item.requests, 0) ?? 0;
  const recentSpend = dashboard?.usage_trend.reduce((sum, item) => sum + Number(item.spend), 0) ?? 0;
  const previousWindow = Math.max(recentRequests - (wallet?.total_requests ?? 0 - recentRequests), 0);
  const trend = previousWindow > 0 ? `${(((recentRequests - previousWindow) / previousWindow) * 100).toFixed(1)}%` : "+0.0%";
  const projectedMonthlySpend = recentSpend > 0 ? (recentSpend / 7) * 30 : 0;
  const dailySpend = projectedMonthlySpend / 30;
  const daysLeft = wallet && dailySpend > 0 ? Math.max(1, Math.floor(Number(wallet.balance) / dailySpend)) : 0;

  return [
    {
      title: "Total Requests",
      value: formatNumber(wallet?.total_requests ?? recentRequests),
      accent: "text-primary-container",
      supporting: `过去 7 天请求 ${formatNumber(recentRequests)} 次`,
      icon: "insights",
      trend: `+${trend.replace("+", "")}`,
    },
    {
      title: "Estimated Cost",
      value: formatMoney(wallet?.total_spent ?? String(recentSpend)),
      accent: "text-on-secondary-container",
      supporting: `Projected monthly spend: ${formatMoney(projectedMonthlySpend.toFixed(2))}`,
      icon: "payments",
    },
    {
      title: "Remaining Credit",
      value: formatMoney(wallet?.balance ?? "0"),
      accent: "text-tertiary",
      supporting: daysLeft > 0 ? `${daysLeft} days left at current run-rate` : "Waiting for more spend history",
      icon: "account_balance_wallet",
    },
  ];
}

function buildUsageChart(dashboard: Awaited<ReturnType<typeof getDashboardOverview>> | null) {
  const points = dashboard?.usage_trend ?? [];
  return points.map((item, index) => ({
    label: new Date(item.bucket).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    requests: item.requests,
    spend: Number(item.spend),
    highlight: index === points.length - 1,
  }));
}

function buildTopModels(
  logs: Awaited<ReturnType<typeof getGatewayLogsPage>>["items"],
  nodeModels: Awaited<ReturnType<typeof getNodeModelsPage>>["items"],
) {
  const usage = new Map<string, number>();
  for (const item of logs) {
    if (!item.model) continue;
    usage.set(item.model, (usage.get(item.model) ?? 0) + 1);
  }
  const max = Math.max(...usage.values(), 1);
  const items = Array.from(usage.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count], index) => ({
      name,
      usage: `${formatNumber(count)} req`,
      fill: Math.max(Math.round((count / max) * 100), 10),
      color: index === 1 ? "bg-primary-container" : "bg-on-surface",
    }));

  if (items.length > 0) {
    return items;
  }

  return nodeModels.slice(0, 4).map((item, index) => ({
    name: item.public_model,
    usage: `${formatMoney((Number(item.input_price) + Number(item.output_price)).toFixed(2))}/M`,
    fill: Math.max(100 - index * 18, 25),
    color: index === 0 ? "bg-primary-container" : "bg-on-surface",
  }));
}

function formatMoney(value: string | number) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatRelative(value: string) {
  const then = new Date(value).getTime();
  const minutes = Math.max(1, Math.round((Date.now() - then) / 60000));
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.round(hours / 24);
  return `${days} days ago`;
}
