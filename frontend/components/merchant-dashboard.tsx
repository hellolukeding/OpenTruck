"use client";

import Link from "next/link";

import { MerchantModelsTableSection } from "@/components/merchant-dashboard-models";
import type { MerchantDashboardData } from "@/lib/admin-console-api";

export function MerchantSubNav({ locale }: { locale: string }) {
  const tabs = [
    { label: "OpenTruck 智能路由", icon: "bolt", href: `/${locale}/merchant`, active: true },
    { label: "总览", icon: "grid_view", href: `/${locale}` },
    { label: "令牌", icon: "key", href: `/${locale}/api-keys` },
    { label: "钱包", icon: "account_balance_wallet", href: `/${locale}/wallet` },
    { label: "日志", icon: "article", href: `/${locale}/logs` },
    { label: "工单", icon: "support_agent", href: `/${locale}/tickets` },
    { label: "设置", icon: "settings", href: `/${locale}/upstream-accounts` },
  ];

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-xs overflow-x-auto rounded-full bg-surface-container p-xs">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`flex items-center gap-sm rounded-full px-lg py-sm whitespace-nowrap transition-colors ${
              tab.active
                ? "bg-primary-container font-medium text-on-primary-container"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span className="text-body-md">{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MerchantHero({
  dashboard,
  locale,
}: {
  dashboard: MerchantDashboardData | null;
  locale: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-outline-variant/30 bg-primary-container text-on-primary-container shadow-sm">
      <div className="absolute top-0 right-0 p-lg">
        <Link
          className="flex items-center gap-xs rounded-lg bg-white/20 px-md py-sm text-body-sm font-medium transition-colors hover:bg-white/30"
          href={`/${locale}/api-keys#new-api-key`}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          创建 OpenTruck Key
        </Link>
      </div>
      <div className="p-lg pt-xl">
        <div className="mb-xs flex items-center gap-sm">
          <span className="material-symbols-outlined text-display">bolt</span>
          <h1 className="text-headline-lg font-headline-lg">{dashboard?.tenant_name ?? "OpenTruck"}</h1>
        </div>
        <p className="max-w-3xl text-body-md opacity-90">
          自动路由到最优商家，故障自动切换，统一管理令牌、收藏商家和当前可用模型目录。
        </p>
      </div>
      <div className="grid grid-cols-3 border-t border-white/20">
        <HeroMetric label="API Keys" value={dashboard?.total_key_count ?? 0} />
        <HeroMetric label="已启用" value={dashboard?.active_key_count ?? 0} bordered />
        <HeroMetric label="可用模型" value={dashboard?.available_model_count ?? 0} bordered />
      </div>
    </section>
  );
}

function HeroMetric({
  label,
  value,
  bordered,
}: {
  label: string;
  value: number;
  bordered?: boolean;
}) {
  return (
    <div className={`p-lg text-center ${bordered ? "border-l border-white/20" : ""}`}>
      <p className="mb-xs text-label-md uppercase tracking-wider opacity-80">{label}</p>
      <p className="text-display leading-none">{value}</p>
    </div>
  );
}

export function MerchantKeysCard({
  dashboard,
  locale,
}: {
  dashboard: MerchantDashboardData | null;
  locale: string;
}) {
  const keys = dashboard?.keys ?? [];

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
      <SectionHeader
        icon="key"
        title="OpenTruck Keys"
        count={keys.length}
        actionLabel="新建"
        actionHref={`/${locale}/api-keys#new-api-key`}
      />
      <div className="space-y-md p-lg">
        {keys.length > 0 ? (
          keys.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-outline-variant/30 bg-surface p-lg transition-all hover:shadow-md"
            >
              <div className="mb-md flex items-start justify-between">
                <div className="space-y-sm">
                  <div className="flex flex-wrap items-center gap-md">
                    <span className="text-headline-md font-headline-md">{item.name}</span>
                    <StatusPill tone={item.status === "active" ? "success" : "neutral"}>
                      {item.status === "active" ? "已启用" : item.status}
                    </StatusPill>
                    <span className="text-body-sm text-on-surface-variant">{item.scope_label}</span>
                  </div>
                  <p className="text-body-sm font-medium text-on-surface-variant">
                    {item.primary_model ?? "未限制模型"}
                  </p>
                </div>
                <div className="flex items-center gap-sm text-on-surface-variant">
                  <Link
                    className="rounded-lg p-sm transition-colors hover:bg-surface-container"
                    href={`/${locale}/api-keys?search=${encodeURIComponent(item.name)}`}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </Link>
                  <Link
                    className="rounded-lg p-sm transition-colors hover:bg-surface-container"
                    href={`/${locale}/api-keys?search=${encodeURIComponent(item.name)}`}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </Link>
                </div>
              </div>
              <div className="mb-sm flex items-center justify-between gap-xl rounded-lg border border-outline-variant/20 bg-surface-container-low px-md py-sm">
                <code className="font-code-md text-code-md tracking-wider">{item.fingerprint}</code>
                <div className="flex items-center gap-md">
                  {["visibility", "content_copy"].map((icon) => (
                    <button
                      key={icon}
                      className="material-symbols-outlined text-[20px] text-secondary transition-colors hover:text-primary"
                      type="button"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-body-sm text-on-surface-variant opacity-70">
                {item.last_used_at ? `最近使用 ${formatDate(item.last_used_at)}` : "暂未使用"}
              </p>
            </div>
          ))
        ) : (
          <EmptyState text="还没有可用的 OpenTruck Key，先创建第一枚令牌。" />
        )}
      </div>
    </section>
  );
}

export function MerchantBookmarks({
  dashboard,
  locale,
}: {
  dashboard: MerchantDashboardData | null;
  locale: string;
}) {
  const bookmarks = dashboard?.bookmarks ?? [];

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between border-b border-outline-variant/20 px-lg py-md">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">storefront</span>
          <h2 className="text-headline-md font-headline-md">
            已收藏商家 <span className="ml-xs text-secondary">{bookmarks.length}</span>
          </h2>
        </div>
        <Link className="flex items-center gap-xs text-body-sm text-primary hover:underline" href="/merchant">
          浏览商家
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        </Link>
      </div>
      <div className="flex flex-wrap gap-md p-lg">
        {bookmarks.length > 0 ? (
          bookmarks.map((item) => (
            <div
              key={item.id}
              className="group inline-flex items-center gap-md rounded-xl border border-outline-variant/20 bg-surface-container-low p-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/20 bg-white text-label-md font-bold text-primary">
                {item.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-body-lg font-headline-md">{item.name}</p>
                <p className="text-body-sm text-on-surface-variant">
                  {item.plan_type ?? "标准计划"} / {item.status}
                </p>
              </div>
              <Link
                className="material-symbols-outlined ml-md text-secondary opacity-0 transition-opacity group-hover:opacity-100"
                href={`/${locale}/upstream-accounts?search=${encodeURIComponent(item.name)}`}
              >
                open_in_new
              </Link>
            </div>
          ))
        ) : (
          <EmptyState text="还没有收藏商家，可以先从商家广场添加常用上游。" />
        )}
      </div>
    </section>
  );
}

export function MerchantModelsTable({
  dashboard,
  locale,
}: {
  dashboard: MerchantDashboardData | null;
  locale: string;
}) {
  return <MerchantModelsTableSection dashboard={dashboard} locale={locale} />;
}

function SectionHeader({
  icon,
  title,
  count,
  actionLabel,
  actionHref,
}: {
  icon: string;
  title: string;
  count?: number;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-outline-variant/20 px-lg py-md">
      <div className="flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <h2 className="text-headline-md font-headline-md">
          {title}
          {typeof count === "number" ? <span className="ml-xs text-secondary">{count}</span> : null}
        </h2>
      </div>
      {actionLabel && actionHref ? (
        <Link
          className="flex items-center gap-xs rounded-lg border border-outline-variant/50 px-md py-sm text-body-sm transition-colors hover:bg-surface-container-low"
          href={actionHref}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

function StatusPill({ children, tone }: { children: string; tone: "success" | "neutral" }) {
  return (
    <span
      className={`rounded px-sm py-xs text-label-md ${
        tone === "success" ? "bg-emerald-100 text-emerald-600" : "bg-surface-container text-on-surface-variant"
      }`}
    >
      {children}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-xl bg-surface px-lg py-xl text-body-md text-on-surface-variant">{text}</div>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
