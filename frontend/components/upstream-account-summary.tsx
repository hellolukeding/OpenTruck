import Link from "next/link";

import type { UpstreamAccount } from "@/lib/admin-api";

type Props = {
  accounts: UpstreamAccount[];
  total: number;
  locale: "en" | "zh-CN";
  path: string;
  query: {
    search?: string;
    status?: string;
    tenant_id?: string;
    account_type?: string;
    platform?: string;
    sort_by?: string;
    sort_order?: string;
  };
  tenantMap: Map<string, string>;
};

export function UpstreamAccountSummary({ accounts, total, locale, path, query, tenantMap }: Props) {
  const t = (en: string, zh: string) => (locale === "zh-CN" ? zh : en);

  const active = accounts.filter((a) => a.status === "active").length;
  const cooling = accounts.filter((a) => a.cooldown_until !== null).length;
  const disabled = accounts.length - active;
  const expiringSoon = accounts.filter((a) => isExpiringSoon(a.token_expires_at)).length;

  const errorCodes = accounts
    .map((a) => a.last_error_code)
    .filter((c): c is string => c !== null);
  const errorMap: Record<string, number> = {};
  for (const code of errorCodes) {
    errorMap[code] = (errorMap[code] || 0) + 1;
  }
  const topErrors = Object.entries(errorMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const tenantCounts = new Map<string, number>();
  for (const account of accounts) {
    tenantCounts.set(account.tenant_id, (tenantCounts.get(account.tenant_id) ?? 0) + 1);
  }
  const topTenants = Array.from(tenantCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <section className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-outline-variant bg-surface p-4">
          <p className="text-code-sm text-on-surface-variant">
            {t("Total accounts", "账号总数")}
          </p>
          <p className="mt-1 font-headline-lg text-headline-lg text-primary">{total}</p>
          <p className="text-code-sm text-on-surface-variant">
            {t("In the tenant pool", "租户池内记录数")}
          </p>
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface p-4">
          <p className="flex items-center gap-1.5 text-code-sm text-on-surface-variant">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {t("Active", "活跃")}
          </p>
          <p className="mt-1 font-headline-lg text-headline-lg text-primary">{active}</p>
          <p className="text-code-sm text-on-surface-variant">
            {t("Eligible for routing", "可参与路由调度")}
          </p>
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface p-4">
          <p className="flex items-center gap-1.5 text-code-sm text-on-surface-variant">
            <span className="h-2 w-2 rounded-full bg-tertiary" />
            {t("Cooling", "冷却中")}
          </p>
          <p className="mt-1 font-headline-lg text-headline-lg text-primary">{cooling}</p>
          <p className="text-code-sm text-on-surface-variant">
            {t("Temporarily removed", "暂时摘除等待恢复")}
          </p>
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface p-4">
          <p className="flex items-center gap-1.5 text-code-sm text-on-surface-variant">
            <span className="h-2 w-2 rounded-full text-on-surface-variant bg-on-surface-variant" />
            {t("Disabled", "禁用")}
          </p>
          <p className="mt-1 font-headline-lg text-headline-lg text-primary">{disabled}</p>
          <p className="text-code-sm text-on-surface-variant">
            {t("Manually stopped", "手动停止")}
          </p>
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface p-4">
          <p className="flex items-center gap-1.5 text-code-sm text-on-surface-variant">
            <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
            {t("Expiring soon", "即将过期")}
          </p>
          <p className="mt-1 font-headline-lg text-headline-lg text-primary">{expiringSoon}</p>
          <p className="text-code-sm text-on-surface-variant">
            {t("Token needs refresh within 24h", "24 小时内需要刷新 token")}
          </p>
        </div>
      </div>

      {/* Status distribution bar */}
      {accounts.length > 0 && (
        <div className="flex h-2 overflow-hidden rounded-full bg-surface-container-high">
          {active > 0 && (
            <div
              className="bg-primary transition-all"
              style={{ width: `${(active / accounts.length) * 100}%` }}
            />
          )}
          {cooling > 0 && (
            <div
              className="bg-tertiary transition-all"
              style={{ width: `${(cooling / accounts.length) * 100}%` }}
            />
          )}
          {disabled > 0 && (
            <div
              className="bg-on-surface-variant/50 transition-all"
              style={{ width: `${(disabled / accounts.length) * 100}%` }}
            />
          )}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        {topErrors.length > 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface p-4">
            <p className="text-code-sm uppercase tracking-wide text-on-surface-variant">
              {t("Top errors (current page)", "高频错误（当前页）")}
            </p>
            <div className="mt-2 space-y-1.5">
              {topErrors.map(([code, count]) => (
                <Link
                  key={code}
                  href={buildHref(path, query, { search: code })}
                  className="flex items-center justify-between rounded-lg px-2 py-1 transition-colors hover:bg-surface-container-low"
                >
                  <span className="text-code-sm font-code-sm text-error">{code}</span>
                  <span className="text-code-sm text-on-surface-variant">{count}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-outline-variant bg-surface p-4">
            <p className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {t("No recent errors on this page.", "当前页暂无错误记录。")}
            </p>
          </div>
        )}

        <div className="rounded-xl border border-outline-variant bg-surface p-4">
          <p className="text-code-sm uppercase tracking-wide text-on-surface-variant">
            {t("Top tenants (current page)", "租户视角（当前页）")}
          </p>
          <div className="mt-2 space-y-1.5">
            {topTenants.length > 0 ? topTenants.map(([tenantId, count]) => (
              <Link
                key={tenantId}
                href={buildHref(path, query, { tenant_id: tenantId })}
                className="flex items-center justify-between rounded-lg px-2 py-1 transition-colors hover:bg-surface-container-low"
              >
                <span className="text-body-sm text-on-surface">{tenantMap.get(tenantId) ?? tenantId}</span>
                <span className="text-code-sm text-on-surface-variant">{count}</span>
              </Link>
            )) : (
              <div className="text-body-sm text-on-surface-variant">
                {t("No tenant distribution yet.", "当前页暂无租户分布。")}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function isExpiringSoon(value: string | null) {
  if (!value) return false;
  const expiresAt = new Date(value).getTime();
  return expiresAt > Date.now() && expiresAt - Date.now() <= 24 * 60 * 60 * 1000;
}

function buildHref(
  path: string,
  query: Props["query"],
  overrides: Partial<Props["query"]>,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...query, ...overrides })) {
    if (value) params.set(key, value);
  }
  return `${path}?${params.toString()}`;
}
