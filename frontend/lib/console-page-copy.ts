import type { Locale } from "@/lib/i18n";

export type DeveloperPageCopy = {
  toolbar: {
    searchPlaceholder: string;
    noticesTitle: string;
    noticesSubtitle: string;
    noticesViewAll: string;
    noticesEmpty: string;
    newKey: string;
  };
  header: {
    title: string;
    signal: string;
    summary: string;
    range: string;
    createKey: string;
  };
  stats: {
    totalRequests: string;
    estimatedCost: string;
    remainingCredit: string;
    last7Days: (count: string) => string;
    projectedMonthly: (amount: string) => string;
    runRate: (days: number) => string;
    waitingSpend: string;
    viewLogs: string;
    billing: string;
    refill: string;
  };
  chart: {
    title: string;
    requests: string;
    spend: string;
  };
  apiKeys: {
    title: string;
    viewAll: string;
    name: string;
    lastUsed: string;
    status: string;
    active: string;
    empty: string;
  };
  models: {
    title: string;
    empty: string;
    footer: string;
    requestsUsage: (count: string) => string;
    priceUsage: (amount: string) => string;
  };
  misc: {
    developerTenant: string;
    waitingData: string;
    balanceLabel: (amount: string) => string;
    never: string;
    relativeMinutes: (count: number) => string;
    relativeHours: (count: number) => string;
    relativeDays: (count: number) => string;
  };
};

const copy: Record<Locale, DeveloperPageCopy> = {
  en: {
    toolbar: {
      searchPlaceholder: "Search usage, keys, or endpoints...",
      noticesTitle: "System notices",
      noticesSubtitle: "Latest platform updates and maintenance windows",
      noticesViewAll: "View all",
      noticesEmpty: "No notices yet",
      newKey: "Generate New Key",
    },
    header: {
      title: "Overview",
      signal: "Live Systems",
      summary: "Monitor your API usage, balance consumption, and model traffic with real tenant data.",
      range: "Last 7 Days",
      createKey: "Generate New Key",
    },
    stats: {
      totalRequests: "Total Requests",
      estimatedCost: "Estimated Cost",
      remainingCredit: "Remaining Credit",
      last7Days: (count) => `${count} requests over the last 7 days`,
      projectedMonthly: (amount) => `Projected monthly spend: ${amount}`,
      runRate: (days) => `${days} days left at current run-rate`,
      waitingSpend: "Waiting for more spend history",
      viewLogs: "View logs",
      billing: "Billing",
      refill: "Refill Balance",
    },
    chart: {
      title: "API Usage Volume",
      requests: "Requests",
      spend: "Spend",
    },
    apiKeys: {
      title: "Active API Keys",
      viewAll: "View All",
      name: "Name",
      lastUsed: "Last Used",
      status: "Status",
      active: "Active",
      empty: "No API keys to display yet.",
    },
    models: {
      title: "Top Models by Usage",
      empty: "No model traffic yet. Hot models will appear here once gateway logs arrive.",
      footer: "Hot models are aggregated from recent gateway requests so operators can spot demand concentration quickly.",
      requestsUsage: (count) => `${count} req`,
      priceUsage: (amount) => `${amount}/M`,
    },
    misc: {
      developerTenant: "Developer Tenant",
      waitingData: "Waiting for data",
      balanceLabel: (amount) => `Balance ${amount}`,
      never: "Never",
      relativeMinutes: (count) => `${count} mins ago`,
      relativeHours: (count) => `${count} hours ago`,
      relativeDays: (count) => `${count} days ago`,
    },
  },
  "zh-CN": {
    toolbar: {
      searchPlaceholder: "搜索用量、密钥或接口...",
      noticesTitle: "系统公告",
      noticesSubtitle: "最新平台通知与维护消息",
      noticesViewAll: "查看全部",
      noticesEmpty: "暂无通知",
      newKey: "生成新密钥",
    },
    header: {
      title: "总览",
      signal: "实时系统",
      summary: "用真实租户数据观察 API 使用、余额消耗和模型流量变化。",
      range: "最近 7 天",
      createKey: "生成新密钥",
    },
    stats: {
      totalRequests: "请求总量",
      estimatedCost: "预估消耗",
      remainingCredit: "剩余额度",
      last7Days: (count) => `过去 7 天请求 ${count} 次`,
      projectedMonthly: (amount) => `预计本月消耗：${amount}`,
      runRate: (days) => `按当前速度还可使用 ${days} 天`,
      waitingSpend: "等待更多消耗历史",
      viewLogs: "查看日志",
      billing: "账务详情",
      refill: "去充值",
    },
    chart: {
      title: "API 使用趋势",
      requests: "请求数",
      spend: "消耗",
    },
    apiKeys: {
      title: "活跃 API 密钥",
      viewAll: "查看全部",
      name: "名称",
      lastUsed: "最近使用",
      status: "状态",
      active: "活跃",
      empty: "暂无可展示的 API Key。",
    },
    models: {
      title: "热点模型",
      empty: "暂无模型调用记录，等网关日志进入后这里会自动出现热点模型。",
      footer: "热点模型基于最近网关请求聚合，方便快速识别当前最常用模型和流量集中位置。",
      requestsUsage: (count) => `${count} 次请求`,
      priceUsage: (amount) => `${amount}/百万 Tokens`,
    },
    misc: {
      developerTenant: "开发者租户",
      waitingData: "等待数据",
      balanceLabel: (amount) => `余额 ${amount}`,
      never: "从未",
      relativeMinutes: (count) => `${count} 分钟前`,
      relativeHours: (count) => `${count} 小时前`,
      relativeDays: (count) => `${count} 天前`,
    },
  },
};

export function getDeveloperPageCopy(locale: Locale) {
  return copy[locale];
}
