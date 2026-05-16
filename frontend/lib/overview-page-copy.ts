import type { Locale } from "@/lib/i18n";

export type OverviewPageCopy = {
  greeting: {
    lateNight: string;
    morning: string;
    noon: string;
    evening: string;
  };
  stats: {
    balance: string;
    recharge: string;
    spend: string;
    requests: string;
    tenantCount: string;
    quota: string;
    failedRequests: string;
    avgRpm: string;
    avgTpm: string;
  };
  notices: {
    title: string;
    chip: string;
    pinned: string;
    itemNumber: (index: number) => string;
    dateLocale: string;
  };
  status: {
    title: string;
    healthyNodes: string;
    activeKeys: string;
    publishedModels: string;
    tenants: string;
    summary: string;
  };
};

const copy: Record<Locale, OverviewPageCopy> = {
  en: {
    greeting: {
      lateNight: "Good early morning",
      morning: "Good morning",
      noon: "Good afternoon",
      evening: "Good evening",
    },
    stats: {
      balance: "Current Balance",
      recharge: "Top up",
      spend: "Historical Spend",
      requests: "Requests",
      tenantCount: "Tenant Count",
      quota: "Quota",
      failedRequests: "Failed Requests",
      avgRpm: "Avg RPM",
      avgTpm: "Avg TPM",
    },
    notices: {
      title: "System Notices",
      chip: "Latest 20 items",
      pinned: "Pinned notice",
      itemNumber: (index) => `Item ${index + 1}`,
      dateLocale: "en-US",
    },
    status: {
      title: "System Status",
      healthyNodes: "Healthy Nodes",
      activeKeys: "Active Keys",
      publishedModels: "Published Models",
      tenants: "Tenants",
      summary: "The overview now runs on real 7-day usage, balance, failed request, and notice data. Next up is model-level ranking and more detailed token metrics.",
    },
  },
  "zh-CN": {
    greeting: {
      lateNight: "凌晨好",
      morning: "早上好",
      noon: "中午好",
      evening: "晚上好",
    },
    stats: {
      balance: "当前余额",
      recharge: "充值",
      spend: "历史消耗",
      requests: "请求次数",
      tenantCount: "统计次数",
      quota: "统计额度",
      failedRequests: "统计Tokens",
      avgRpm: "平均RPM",
      avgTpm: "平均TPM",
    },
    notices: {
      title: "系统公告",
      chip: "显示最新20条",
      pinned: "置顶公告",
      itemNumber: (index) => `第 ${index + 1} 条`,
      dateLocale: "zh-CN",
    },
    status: {
      title: "系统状态",
      healthyNodes: "健康节点",
      activeKeys: "活跃密钥",
      publishedModels: "已发布模型",
      tenants: "租户数",
      summary: "当前总览已接入真实近 7 日 usage、余额、失败请求和公告流。下一步会继续补模型维度排行与更细的 tokens 指标。",
    },
  },
};

export function getOverviewPageCopy(locale: Locale) {
  return copy[locale];
}
