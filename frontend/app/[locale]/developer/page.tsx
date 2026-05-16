import { notFound } from "next/navigation";
import Link from "next/link";

import { DeveloperApiKeys, DeveloperTopModels } from "@/components/developer-analytics";
import { DeveloperStats, DeveloperUsageChart } from "@/components/developer-dashboard";
import { DeveloperFooter } from "@/components/developer-footer";
import { DeveloperSidebar } from "@/components/developer-sidebar";
import { DeveloperToolbar } from "@/components/developer-toolbar";
import { getDashboardOverview, getGatewayLogsPage, getWalletOverview } from "@/lib/admin-console-api";
import { getAdminOverview, getApiKeysPage, getNodeModelsPage } from "@/lib/admin-api";
import { getDeveloperPageCopy } from "@/lib/console-page-copy";
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
  const copy = getDeveloperPageCopy(typedLocale);
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

  const stats = buildStats(dashboard, wallet, typedLocale, copy);
  const chart = buildUsageChart(dashboard, typedLocale);
  const newKeyHref = `/${typedLocale}/api-keys#new-api-key`;
  const logsHref = `/${typedLocale}/logs`;
  const keys = (apiKeysPage?.items ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    fingerprint: `${item.key_hash.slice(0, 6)}...${item.key_hash.slice(-4)}`,
    lastUsed: item.last_used_at ? formatRelative(item.last_used_at, copy) : copy.misc.never,
    status: item.status,
  }));
  const topModels = buildTopModels(logsPage?.items ?? [], nodeModelsPage?.items ?? [], typedLocale, copy);

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      <DeveloperSidebar
        locale={typedLocale}
        tenantName={tenant?.name ?? copy.misc.developerTenant}
        planLabel={wallet ? copy.misc.balanceLabel(formatMoney(wallet.balance)) : copy.misc.waitingData}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <DeveloperToolbar
          locale={typedLocale}
          logsHref={logsHref}
          newKeyHref={newKeyHref}
          notices={dashboard?.notices ?? []}
          copy={copy.toolbar}
        />

        <div className="p-gutter md:p-margin max-w-max-width mx-auto w-full space-y-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-headline-md text-headline-md text-on-surface">{copy.header.title}</h2>
                <div className="flex items-center gap-2 bg-primary-container/10 px-2 py-0.5 rounded border border-primary-container/20">
                  <div className="pulse-dot" />
                  <span className="font-label-md text-label-md text-primary">{copy.header.signal}</span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-secondary-container">
                {copy.header.summary}
              </p>
            </div>
            <div className="flex gap-sm">
              <Link className="px-4 py-2 bg-white border border-outline-variant text-on-surface rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container-high transition-all" href={logsHref}>
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                {copy.header.range}
              </Link>
              <Link className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-surface-tint shadow-sm transition-all active:scale-95" href={newKeyHref}>
                <span className="material-symbols-outlined text-[18px]">vpn_key</span>
                {copy.header.createKey}
              </Link>
            </div>
          </div>

          <DeveloperStats cards={stats} />
          <DeveloperUsageChart points={chart} copy={copy.chart} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            <DeveloperApiKeys keys={keys} locale={typedLocale} copy={copy.apiKeys} />
            <DeveloperTopModels models={topModels} locale={typedLocale} copy={copy.models} />
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
  locale: string,
  copy: ReturnType<typeof getDeveloperPageCopy>,
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
      title: copy.stats.totalRequests,
      value: formatNumber(wallet?.total_requests ?? recentRequests, locale),
      accent: "text-primary-container",
      supporting: copy.stats.last7Days(formatNumber(recentRequests, locale)),
      icon: "insights",
      trend: `+${trend.replace("+", "")}`,
      ctaLabel: copy.stats.viewLogs,
      href: `/${locale}/logs`,
    },
    {
      title: copy.stats.estimatedCost,
      value: formatMoney(wallet?.total_spent ?? String(recentSpend)),
      accent: "text-on-secondary-container",
      supporting: copy.stats.projectedMonthly(formatMoney(projectedMonthlySpend.toFixed(2))),
      icon: "payments",
      ctaLabel: copy.stats.billing,
      href: `/${locale}/wallet`,
    },
    {
      title: copy.stats.remainingCredit,
      value: formatMoney(wallet?.balance ?? "0"),
      accent: "text-tertiary",
      supporting: daysLeft > 0 ? copy.stats.runRate(daysLeft) : copy.stats.waitingSpend,
      icon: "account_balance_wallet",
      ctaLabel: copy.stats.refill,
      href: `/${locale}/wallet`,
    },
  ];
}

function buildUsageChart(
  dashboard: Awaited<ReturnType<typeof getDashboardOverview>> | null,
  locale: string,
) {
  const points = dashboard?.usage_trend ?? [];
  return points.map((item, index) => ({
    label: new Date(item.bucket).toLocaleDateString(locale, { month: "short", day: "numeric" }),
    requests: item.requests,
    spend: Number(item.spend),
    highlight: index === points.length - 1,
    href: buildDayLogHref(locale, item.bucket),
  }));
}

function buildTopModels(
  logs: Awaited<ReturnType<typeof getGatewayLogsPage>>["items"],
  nodeModels: Awaited<ReturnType<typeof getNodeModelsPage>>["items"],
  locale: string,
  copy: ReturnType<typeof getDeveloperPageCopy>,
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
      usage: copy.models.requestsUsage(formatNumber(count, locale)),
      fill: Math.max(Math.round((count / max) * 100), 10),
      color: index === 1 ? "bg-primary-container" : "bg-on-surface",
      href: buildLogHref(locale, name),
    }));

  if (items.length > 0) {
    return items;
  }

  return nodeModels.slice(0, 4).map((item, index) => ({
    name: item.public_model,
    usage: copy.models.priceUsage(formatMoney((Number(item.input_price) + Number(item.output_price)).toFixed(2))),
    fill: Math.max(100 - index * 18, 25),
    color: index === 0 ? "bg-primary-container" : "bg-on-surface",
    href: buildLogHref(locale, item.public_model),
  }));
}

function buildLogHref(locale: string, model: string) {
  return `/${locale}/logs?model=${encodeURIComponent(model)}`;
}

function buildDayLogHref(locale: string, bucket: string) {
  const startAt = `${bucket}T00:00:00`;
  const endAt = `${bucket}T23:59:59`;
  return `/${locale}/logs?startAt=${encodeURIComponent(startAt)}&endAt=${encodeURIComponent(endAt)}`;
}

function formatMoney(value: string | number) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value);
}

function formatRelative(value: string, copy: ReturnType<typeof getDeveloperPageCopy>) {
  const then = new Date(value).getTime();
  const minutes = Math.max(1, Math.round((Date.now() - then) / 60000));
  if (minutes < 60) return copy.misc.relativeMinutes(minutes);
  const hours = Math.round(minutes / 60);
  if (hours < 24) return copy.misc.relativeHours(hours);
  const days = Math.round(hours / 24);
  return copy.misc.relativeDays(days);
}
