import type { Locale } from "@/lib/i18n";

export type LogsPageCopy = {
  summary: {
    spend: (amount: string) => string;
    records: (count: number) => string;
    averageTokens: (count: string) => string;
    compactList: string;
  };
  filters: {
    startDatePlaceholder: string;
    endDatePlaceholder: string;
    searchLabel: string;
    modelLabel: string;
    requestKindLabel: string;
    statusLabel: string;
    searchPlaceholder: string;
    startAtPlaceholder: string;
    endAtPlaceholder: string;
    modelPlaceholder: string;
    requestKindPlaceholder: string;
    allStatuses: string;
    submit: string;
    reset: string;
  };
  table: {
    tenantUpstream: string;
    tokensSpend: string;
    status: string;
    unknownKey: string;
    noResponseId: string;
    unknownTenant: string;
    pendingUpstream: string;
    noResults: string;
  };
};

const copy: Record<Locale, LogsPageCopy> = {
  en: {
    summary: {
      spend: (amount) => `Spend: ¥${amount}`,
      records: (count) => `Records: ${count}`,
      averageTokens: (count) => `Avg Tokens: ${count}`,
      compactList: "Compact List",
    },
    filters: {
      startDatePlaceholder: "YYYY / MM / DD --:--",
      endDatePlaceholder: "YYYY / MM / DD --:--",
      searchLabel: "Key name",
      modelLabel: "Model name",
      requestKindLabel: "Request kind",
      statusLabel: "Status",
      searchPlaceholder: "Search by key, model, or response id",
      startAtPlaceholder: "Start time ISO",
      endAtPlaceholder: "End time ISO",
      modelPlaceholder: "Model name",
      requestKindPlaceholder: "Request kind",
      allStatuses: "All statuses",
      submit: "Search",
      reset: "Reset",
    },
    table: {
      tenantUpstream: "Tenant / Upstream",
      tokensSpend: "Tokens / Spend",
      status: "Status",
      unknownKey: "unknown-key",
      noResponseId: "no-response-id",
      unknownTenant: "unknown",
      pendingUpstream: "pending",
      noResults: "No results found",
    },
  },
  "zh-CN": {
    summary: {
      spend: (amount) => `消耗额度: ¥${amount}`,
      records: (count) => `记录数: ${count}`,
      averageTokens: (count) => `平均 Tokens: ${count}`,
      compactList: "紧凑列表",
    },
    filters: {
      startDatePlaceholder: "年 / 月 / 日  --:--",
      endDatePlaceholder: "年 / 月 / 日  --:--",
      searchLabel: "令牌名称",
      modelLabel: "模型名称",
      requestKindLabel: "请求类型",
      statusLabel: "状态",
      searchPlaceholder: "按 key、模型、response id 搜索",
      startAtPlaceholder: "开始时间 ISO",
      endAtPlaceholder: "结束时间 ISO",
      modelPlaceholder: "模型名称",
      requestKindPlaceholder: "请求类型",
      allStatuses: "全部状态",
      submit: "查询",
      reset: "重置",
    },
    table: {
      tenantUpstream: "租户 / 上游",
      tokensSpend: "Tokens / 消耗",
      status: "状态",
      unknownKey: "unknown-key",
      noResponseId: "no-response-id",
      unknownTenant: "unknown",
      pendingUpstream: "pending",
      noResults: "搜索无结果",
    },
  },
};

export function getLogsPageCopy(locale: Locale) {
  return copy[locale];
}
