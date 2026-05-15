import { Filter, RefreshCw, SunMedium, Wallet, ChartColumn, Rocket, Hash, Coins, Database, Gauge, Cpu, Megaphone } from "lucide-react";

import type { ApiKey, Node, NodeModel, Tenant } from "@/lib/admin-api";
import type { DashboardDictionary } from "@/lib/i18n";
import { AdminOverviewAnalysis } from "@/components/admin-overview-analysis";
import { AdminOverviewNotices } from "@/components/admin-overview-notices";
import { AdminOverviewStats } from "@/components/admin-overview-stats";

type AdminOverviewProps = {
  tenants: Tenant[];
  nodes: Node[];
  apiKeys: ApiKey[];
  nodeModels: NodeModel[];
  dictionary: DashboardDictionary;
};

export function AdminOverview({
  tenants,
  nodes,
  apiKeys,
  nodeModels,
  dictionary,
}: AdminOverviewProps) {
  const totalQuota = tenants.reduce((sum, item) => sum + parseNumber(item.quota_balance), 0);
  const avgRpm = average(tenants.map((item) => item.rate_limit_rpm));
  const avgTpm = average(tenants.map((item) => item.rate_limit_tpm));
  const greeting = getGreeting();

  const stats = [
    { label: "当前余额", value: money(totalQuota), icon: Wallet, accent: "text-[#12a594]", action: "充值" },
    { label: "历史消耗", value: "¥0.00", icon: ChartColumn, accent: "text-[#7b7af7]" },
    { label: "请求次数", value: String(apiKeys.length), icon: Rocket, accent: "text-[#22b85a]" },
    { label: "统计次数", value: String(nodeModels.length), icon: Hash, accent: "text-[#0ea5a7]" },
    { label: "统计额度", value: money(totalQuota), icon: Coins, accent: "text-[#f59e0b]" },
    { label: "统计Tokens", value: "0", icon: Database, accent: "text-[#ef476f]" },
    { label: "平均RPM", value: avgRpm.toFixed(3), icon: Gauge, accent: "text-[#2aa8ff]" },
    { label: "平均TPM", value: String(Math.round(avgTpm)), icon: Cpu, accent: "text-[#ff7a1a]" },
  ];

  const notices = [
    "每日商家推荐：猫佬API Claude Max 特惠 Max 临时特惠渠道，可外接百分百真实 cctest 100分。",
    "每日商家推荐 AKAClaude 专注供应 Claude 系列模型，专注、稳定、物美价廉。",
    "今晚会更新一个版本，预计会有 1 分钟左右短暂卡顿，感谢理解。",
    "智能路由系统正在持续优化，如果遇到断流或疑难问题，可尝试重新生成商户 Key。",
  ];

  return (
    <div className="space-y-5">
      <section className="flex items-start justify-between gap-4 rounded-[24px] border border-transparent px-1 py-4">
        <div>
          <h1 className="text-[2.15rem] font-semibold tracking-[-0.06em] text-on-surface">
            👋{greeting}，oidc_5118
          </h1>
          <p className="mt-2 text-[0.9rem] text-on-surface-variant">
            {dictionary.overview.signalSummary}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {[Filter, RefreshCw].map((Icon) => (
            <button
              key={Icon.displayName}
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-outline-variant/30 bg-surface-container-lowest text-on-surface shadow-sm transition-colors hover:bg-surface-container-low dark:bg-surface-container-low"
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>
      </section>

      <AdminOverviewStats stats={stats} />

      <AdminOverviewAnalysis />

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminOverviewNotices
          title="系统公告"
          chip="显示最新20条"
          items={notices}
        />
        <section className="rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest shadow-sm dark:bg-surface-container-low/60">
          <div className="flex items-center gap-3 border-b border-outline-variant/10 px-5 py-4">
            <SunMedium className="h-5 w-5 text-primary" />
            <h2 className="text-[1.25rem] font-semibold text-on-surface">系统状态</h2>
          </div>
          <div className="space-y-4 px-5 py-5">
            <StatusRow label="健康节点" value={`${nodes.filter((item) => item.health_status === "ok").length}/${nodes.length || 0}`} />
            <StatusRow label="活跃密钥" value={String(apiKeys.filter((item) => item.status === "active").length)} />
            <StatusRow label="已发布模型" value={String(new Set(nodeModels.map((item) => item.public_model)).size)} />
            <StatusRow label="租户数" value={String(tenants.length)} />
            <div className="rounded-[18px] border border-outline-variant/20 bg-surface-container-low px-4 py-4 text-[0.82rem] leading-6 text-on-surface-variant dark:bg-surface-container">
              当前总览以静态运营视角为主。后续接入真实 usage、tokens、消费和公告流后，这块会进一步和参考台面靠齐。
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[16px] border border-outline-variant/20 bg-surface px-4 py-3 dark:bg-surface-container-low">
      <span className="text-[0.86rem] text-on-surface-variant">{label}</span>
      <span className="text-[1rem] font-semibold text-on-surface">{value}</span>
    </div>
  );
}

function getGreeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Shanghai",
    }).format(new Date()),
  );
  if (hour < 6) return "凌晨好";
  if (hour < 12) return "早上好";
  if (hour < 18) return "中午好";
  return "晚上好";
}

function parseNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function money(value: number) {
  return `¥${value.toFixed(2)}`;
}
