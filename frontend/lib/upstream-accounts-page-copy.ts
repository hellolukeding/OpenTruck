import type { Locale } from "@/lib/i18n";

export type UpstreamAccountsPageCopy = {
  table: {
    eyebrow: string;
    title: string;
    description: string;
    empty: string;
    noteTitle: string;
    noteBody: string;
    labels: {
      tenant: string;
      status: string;
      priority: string;
      lastUsed: string;
      cooldown: string;
        lastError: string;
        refresh: string;
        email: string;
      failures: string;
      never: string;
      clear: string;
      hasRefreshToken: string;
      noRefreshToken: string;
    };
  };
  summary: {
    totalAccounts: string;
    inTenantPool: string;
    active: string;
    eligibleForRouting: string;
    cooling: string;
    temporarilyRemoved: string;
    disabled: string;
    manuallyStopped: string;
    expiringSoon: string;
    tokenNeedsRefresh: string;
    topErrors: string;
    noRecentErrors: string;
    topTenants: string;
    noTenantDistribution: string;
  };
};

const copy: Record<Locale, UpstreamAccountsPageCopy> = {
  en: {
    table: {
      eyebrow: "Upstream pool",
      title: "Operate real Codex identities as schedulable inventory.",
      description:
        "This page exposes the OpenAI OAuth upstream accounts behind each tenant, including priority, cooldown state, recency, and last error so the pool behaves like sub2api rather than a blind proxy.",
      empty: "No upstream accounts connected yet.",
      noteTitle: "Scheduler note",
      noteBody:
        "The gateway now prefers lower priority accounts and skips identities that are cooling down or already expired. The table reflects the same live scheduler metadata the backend is using.",
      labels: {
        tenant: "Tenant",
        status: "Status",
        priority: "Priority",
        lastUsed: "Last used",
        cooldown: "Cooldown until",
        lastError: "Last error",
        refresh: "Refresh",
        email: "Email",
        failures: "Failures",
        never: "Never",
        clear: "Clear",
        hasRefreshToken: "Has refresh token",
        noRefreshToken: "No refresh token",
      },
    },
    summary: {
      totalAccounts: "Total accounts",
      inTenantPool: "In the tenant pool",
      active: "Active",
      eligibleForRouting: "Eligible for routing",
      cooling: "Cooling",
      temporarilyRemoved: "Temporarily removed",
      disabled: "Disabled",
      manuallyStopped: "Manually stopped",
      expiringSoon: "Expiring soon",
      tokenNeedsRefresh: "Token needs refresh within 24h",
      topErrors: "Top errors (current page)",
      noRecentErrors: "No recent errors on this page.",
      topTenants: "Top tenants (current page)",
      noTenantDistribution: "No tenant distribution yet.",
    },
  },
  "zh-CN": {
    table: {
      eyebrow: "上游账号池",
      title: "把真实 Codex 身份当作可调度资源来运营。",
      description:
        "这里展示租户名下的 OpenAI OAuth 上游账号，以及优先级、冷却状态、最近使用时间和最近错误，方便你按 sub2api 的方式管理账号池。",
      empty: "当前还没有接入任何上游账号。",
      noteTitle: "调度说明",
      noteBody:
        "网关现在会优先选择更低的 priority，并避开冷却中或已过期的账号。这里的字段就是调度层正在使用的真实状态。",
      labels: {
        tenant: "租户",
        status: "状态",
        priority: "优先级",
        lastUsed: "最近使用",
        cooldown: "冷却至",
        lastError: "最近错误",
        refresh: "刷新",
        email: "邮箱",
        failures: "失败次数",
        never: "从未",
        clear: "无",
        hasRefreshToken: "有 refresh token",
        noRefreshToken: "无 refresh token",
      },
    },
    summary: {
      totalAccounts: "账号总数",
      inTenantPool: "租户池内记录数",
      active: "活跃",
      eligibleForRouting: "可参与路由调度",
      cooling: "冷却中",
      temporarilyRemoved: "暂时摘除等待恢复",
      disabled: "禁用",
      manuallyStopped: "手动停止",
      expiringSoon: "即将过期",
      tokenNeedsRefresh: "24 小时内需要刷新 token",
      topErrors: "高频错误（当前页）",
      noRecentErrors: "当前页暂无错误记录。",
      topTenants: "租户视角（当前页）",
      noTenantDistribution: "当前页暂无租户分布。",
    },
  },
};

export function getUpstreamAccountsPageCopy(locale: Locale) {
  return copy[locale];
}
