import type { Locale } from "@/lib/i18n";

export type MerchantPageCopy = {
  subNav: {
    home: string;
    overview: string;
    keys: string;
    wallet: string;
    logs: string;
    tickets: string;
    settings: string;
  };
  hero: {
    createKey: string;
    summary: string;
    totalKeys: string;
    activeKeys: string;
    availableModels: string;
    defaultTenant: string;
  };
  keys: {
    title: string;
    action: string;
    active: string;
    noPrimaryModel: string;
    lastUsed: (value: string) => string;
    neverUsed: string;
    empty: string;
  };
  bookmarks: {
    title: string;
    browse: string;
    defaultPlan: string;
    empty: string;
  };
  models: {
    title: string;
    modelName: string;
    statusPricing: string;
    merchants: string;
    lowestPrice: string;
    merchantsProvide: (count: number) => string;
    empty: string;
    freePerMillion: string;
    paidPerMillion: (amount: string) => string;
  };
  footer: {
    copyright: string;
    resources: string;
    documentation: string;
    changelog: string;
    status: string;
    company: string;
    privacy: string;
    terms: string;
    community: string;
  };
};

const copy: Record<Locale, MerchantPageCopy> = {
  en: {
    subNav: {
      home: "OpenTruck Smart Routing",
      overview: "Overview",
      keys: "Keys",
      wallet: "Wallet",
      logs: "Logs",
      tickets: "Tickets",
      settings: "Settings",
    },
    hero: {
      createKey: "Create OpenTruck Key",
      summary: "Route automatically to the best merchants, fail over safely, and manage keys, bookmarks, and available models in one place.",
      totalKeys: "API Keys",
      activeKeys: "Active",
      availableModels: "Available Models",
      defaultTenant: "OpenTruck",
    },
    keys: {
      title: "OpenTruck Keys",
      action: "New",
      active: "Active",
      noPrimaryModel: "No model restriction",
      lastUsed: (value) => `Last used ${value}`,
      neverUsed: "Never used yet",
      empty: "No OpenTruck keys yet. Create your first key to start routing traffic.",
    },
    bookmarks: {
      title: "Bookmarked Merchants",
      browse: "Browse merchants",
      defaultPlan: "Standard plan",
      empty: "No merchants bookmarked yet. Add your most-used upstreams from the marketplace.",
    },
    models: {
      title: "Available Models",
      modelName: "Model Name",
      statusPricing: "Status / Pricing",
      merchants: "Merchants",
      lowestPrice: "Lowest price:",
      merchantsProvide: (count) => `${count} merchants`,
      empty: "No models available yet. This list will populate after upstream sync completes.",
      freePerMillion: "Free / M",
      paidPerMillion: (amount) => `${amount}/M`,
    },
    footer: {
      copyright: "&copy; 2024 OpenTruck. High-performance AI infrastructure.",
      resources: "Resources",
      documentation: "Documentation",
      changelog: "Changelog",
      status: "Status",
      company: "Company",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      community: "Community",
    },
  },
  "zh-CN": {
    subNav: {
      home: "OpenTruck 智能路由",
      overview: "总览",
      keys: "令牌",
      wallet: "钱包",
      logs: "日志",
      tickets: "工单",
      settings: "设置",
    },
    hero: {
      createKey: "创建 OpenTruck Key",
      summary: "自动路由到最优商家，故障自动切换，统一管理令牌、收藏商家和当前可用模型目录。",
      totalKeys: "API Keys",
      activeKeys: "已启用",
      availableModels: "可用模型",
      defaultTenant: "OpenTruck",
    },
    keys: {
      title: "OpenTruck Keys",
      action: "新建",
      active: "已启用",
      noPrimaryModel: "未限制模型",
      lastUsed: (value) => `最近使用 ${value}`,
      neverUsed: "暂未使用",
      empty: "还没有可用的 OpenTruck Key，先创建第一枚令牌。",
    },
    bookmarks: {
      title: "已收藏商家",
      browse: "浏览商家",
      defaultPlan: "标准计划",
      empty: "还没有收藏商家，可以先从商家广场添加常用上游。",
    },
    models: {
      title: "可用模型",
      modelName: "模型名称",
      statusPricing: "状态 / 价格",
      merchants: "商家数",
      lowestPrice: "最低价格:",
      merchantsProvide: (count) => `${count} 个商家提供`,
      empty: "暂无可用模型，等上游节点同步后这里会自动出现。",
      freePerMillion: "免费/M",
      paidPerMillion: (amount) => `${amount}/M`,
    },
    footer: {
      copyright: "&copy; 2024 OpenTruck. 高性能 AI 基础设施。",
      resources: "资源",
      documentation: "文档",
      changelog: "更新日志",
      status: "状态页",
      company: "公司",
      privacy: "隐私政策",
      terms: "服务条款",
      community: "社区",
    },
  },
};

export function getMerchantPageCopy(locale: Locale) {
  return copy[locale];
}
