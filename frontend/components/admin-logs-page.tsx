import { CalendarDays, ListFilter, RotateCcw, Search } from "lucide-react";

import { AdminLogsFilters } from "@/components/admin-logs-filters";
import type { PaginatedResponse } from "@/lib/admin-console-api";
import type { GatewayUsageLog } from "@/lib/admin-console-api";

export function AdminLogsPage({
  logsPage,
  path,
  query,
}: {
  logsPage: PaginatedResponse<GatewayUsageLog>;
  path: string;
  query: {
    search?: string;
    status?: string;
    model?: string;
    requestKind?: string;
    startAt?: string;
    endAt?: string;
  };
}) {
  const totalSpend = logsPage.items.reduce((sum, item) => sum + Number(item.quota_delta), 0);
  const totalTokens = logsPage.items.reduce((sum, item) => sum + item.total_tokens, 0);
  const avgTokens = logsPage.items.length > 0 ? totalTokens / logsPage.items.length : 0;

  return (
    <section className="rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest shadow-sm dark:bg-surface-container-low/60">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/10 px-5 py-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge text={`消耗额度: ¥${totalSpend.toFixed(2)}`} tone="teal" />
          <Badge text={`记录数: ${logsPage.pagination.total}`} tone="amber" />
          <Badge text={`平均 Tokens: ${avgTokens.toFixed(0)}`} tone="neutral" />
        </div>
        <button className="text-[1rem] font-semibold text-on-surface">紧凑列表</button>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <InputLike icon={<CalendarDays className="h-4 w-4" />} label={query.startAt || "年 / 月 / 日  --:--"} />
          <InputLike icon={<CalendarDays className="h-4 w-4" />} label={query.endAt || "年 / 月 / 日  --:--"} />
          <InputLike icon={<Search className="h-4 w-4" />} label={query.search || "令牌名称"} />
          <InputLike icon={<Search className="h-4 w-4" />} label={query.model || "模型名称"} />
          <InputLike icon={<Search className="h-4 w-4" />} label={query.requestKind || "请求类型"} />
          <InputLike icon={<Search className="h-4 w-4" />} label={query.status || "状态"} />
        </div>

        <AdminLogsFilters path={path} query={query} />

        {logsPage.items.length > 0 ? (
          <div className="overflow-hidden rounded-[20px] border border-outline-variant/10 bg-surface dark:bg-surface-container-low">
            {logsPage.items.map((item) => (
              <article
                key={item.id}
                className="grid gap-3 border-t border-outline-variant/10 px-5 py-4 first:border-t-0 md:grid-cols-[1.2fr_0.9fr_0.9fr_0.7fr]"
              >
                <div>
                  <p className="text-[0.92rem] font-semibold text-on-surface">{item.model ?? item.endpoint}</p>
                  <p className="mt-1 text-[0.78rem] text-on-surface-variant">
                    {item.api_key_name ?? "unknown-key"} / {item.request_kind} / {item.response_id ?? "no-response-id"}
                  </p>
                </div>
                <div>
                  <p className="text-[0.82rem] text-on-surface-variant">租户 / 上游</p>
                  <p className="mt-1 text-[0.9rem] text-on-surface">
                    {item.tenant_name ?? "unknown"} / {item.upstream_account_name ?? "pending"}
                  </p>
                </div>
                <div>
                  <p className="text-[0.82rem] text-on-surface-variant">Tokens / 消耗</p>
                  <p className="mt-1 text-[0.9rem] text-on-surface">
                    {item.total_tokens} / ¥{Number(item.quota_delta).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[0.82rem] text-on-surface-variant">状态</p>
                  <p className="mt-1 text-[0.9rem] font-medium text-on-surface">
                    {item.status}
                    {item.error_code ? ` · ${item.error_code}` : ""}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-log-card flex-col items-center justify-center rounded-[20px] border border-outline-variant/10 bg-surface dark:bg-surface-container-low">
            <div className="rounded-full bg-surface-container-low p-5 text-on-surface-variant">
              <Search className="h-12 w-12" />
            </div>
            <p className="mt-6 text-[1.55rem] font-semibold text-on-surface-variant">搜索无结果</p>
          </div>
        )}
      </div>
    </section>
  );
}

function Badge({ text, tone }: { text: string; tone: "teal" | "amber" | "neutral" }) {
  const tones = {
    teal: "border-[#cdeee7] bg-[#edf9f6] text-[#0f766e]",
    amber: "border-[#f8deb2] bg-[#fff7e7] text-[#b45309]",
    neutral: "border-outline-variant/20 bg-surface text-on-surface",
  };

  return <div className={`rounded-[16px] border px-5 py-3 text-[0.95rem] font-semibold ${tones[tone]}`}>{text}</div>;
}

function InputLike({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-[14px] border border-outline-variant/20 bg-surface px-4 text-[0.94rem] text-on-surface-variant dark:bg-surface-container-low">
      {icon}
      <span>{label}</span>
    </div>
  );
}
