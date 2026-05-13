import type { UpstreamAccount } from "@/lib/admin-api";

type Props = {
  accounts: UpstreamAccount[];
  total: number;
  locale: "en" | "zh-CN";
};

export function UpstreamAccountSummary({ accounts, total, locale }: Props) {
  const t = (en: string, zh: string) => (locale === "zh-CN" ? zh : en);

  const active = accounts.filter((a) => a.status === "active").length;
  const cooling = accounts.filter((a) => a.cooldown_until !== null).length;
  const disabled = accounts.length - active;

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

      {/* Top errors */}
      {topErrors.length > 0 ? (
        <div className="rounded-xl border border-outline-variant bg-surface p-4">
          <p className="text-code-sm uppercase tracking-wide text-on-surface-variant">
            {t("Top errors (current page)", "高频错误（当前页）")}
          </p>
          <div className="mt-2 space-y-1.5">
            {topErrors.map(([code, count]) => (
              <div key={code} className="flex items-center justify-between">
                <span className="text-code-sm font-code-sm text-error">{code}</span>
                <span className="text-code-sm text-on-surface-variant">{count}</span>
              </div>
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
    </section>
  );
}
