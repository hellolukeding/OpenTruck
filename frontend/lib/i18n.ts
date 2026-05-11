export const SUPPORTED_LOCALES = ["en", "zh-CN"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export type DashboardDictionary = {
  languageLabel: string;
  languages: Record<Locale, string>;
  heroKicker: string;
  heroTitle: string;
  heroSummary: string;
  backendLabel: string;
  backendOnline: string;
  backendOffline: string;
  backendHint: string;
  metrics: {
    tenants: string;
    nodes: string;
    routes: string;
    credentials: string;
    issuedKeys: (count: number) => string;
    healthyNodes: (count: number) => string;
    totalMappings: (count: number) => string;
    totalKeys: (count: number) => string;
  };
  sections: {
    tenants: string;
    tenantsTitle: string;
    nodes: string;
    nodesTitle: string;
    keys: string;
    keysTitle: string;
    models: string;
    modelsTitle: string;
  };
  labels: {
    name: string;
    status: string;
    quota: string;
    rpm: string;
    tpm: string;
    tenant: string;
    lastUsed: string;
    fingerprint: string;
    publicModel: string;
    externalModel: string;
    priority: string;
    input: string;
    output: string;
    region: string;
    weight: string;
    concurrency: string;
    never: string;
  };
};

const dictionaries: Record<Locale, DashboardDictionary> = {
  en: {
    languageLabel: "Language",
    languages: { en: "English", "zh-CN": "简体中文" },
    heroKicker: "OpenTruck Admin Surface",
    heroTitle: "Operate the gateway like a control room, not a toy dashboard.",
    heroSummary:
      "A monochrome dispatch board for tenants, credentials, nodes, and public model routes. The layout stays restrained, dense, and operational so it feels closer to OpenAI's product language than a decorative SaaS panel.",
    backendLabel: "Backend link",
    backendOnline: "Live admin API connected",
    backendOffline: "Backend currently unavailable",
    backendHint:
      "Frontend reads directly from the FastAPI admin endpoints. Start the backend on port 8000 or override BACKEND_BASE_URL.",
    metrics: {
      tenants: "Tenants",
      nodes: "Nodes",
      routes: "Routes",
      credentials: "Credentials",
      issuedKeys: (count) => `${count} issued keys`,
      healthyNodes: (count) => `${count} healthy`,
      totalMappings: (count) => `${count} total mappings`,
      totalKeys: (count) => `${count} total keys`,
    },
    sections: {
      tenants: "Tenant registry",
      tenantsTitle: "Quota ownership",
      nodes: "Node convoy",
      nodesTitle: "Upstream capacity",
      keys: "Key issuance",
      keysTitle: "Credential ledger",
      models: "Routing surface",
      modelsTitle: "Published model lanes",
    },
    labels: {
      name: "Name",
      status: "Status",
      quota: "Quota",
      rpm: "RPM",
      tpm: "TPM",
      tenant: "Tenant",
      lastUsed: "Last used",
      fingerprint: "Fingerprint",
      publicModel: "Public model",
      externalModel: "External model",
      priority: "Priority",
      input: "Input",
      output: "Output",
      region: "Region",
      weight: "Weight",
      concurrency: "Max concurrency",
      never: "Never",
    },
  },
  "zh-CN": {
    languageLabel: "语言",
    languages: { en: "English", "zh-CN": "简体中文" },
    heroKicker: "OpenTruck 管理界面",
    heroTitle: "像调度控制室一样运营网关，而不是做一个玩具面板。",
    heroSummary:
      "这是一个黑白中性的调度面板，用来管理租户、凭证、节点和公开模型路由。整体刻意保持克制、紧凑和偏运营的感觉，更接近 OpenAI 产品气质，而不是装饰型 SaaS 仪表盘。",
    backendLabel: "后端连接",
    backendOnline: "已连接实时管理 API",
    backendOffline: "后端当前不可用",
    backendHint:
      "前端会直接读取 FastAPI 的管理接口。请在 8000 端口启动后端，或覆盖 BACKEND_BASE_URL。",
    metrics: {
      tenants: "租户",
      nodes: "节点",
      routes: "路由",
      credentials: "凭证",
      issuedKeys: (count) => `已签发 ${count} 个密钥`,
      healthyNodes: (count) => `${count} 个健康节点`,
      totalMappings: (count) => `${count} 条模型映射`,
      totalKeys: (count) => `${count} 个总密钥`,
    },
    sections: {
      tenants: "租户登记",
      tenantsTitle: "配额归属",
      nodes: "节点编队",
      nodesTitle: "上游容量",
      keys: "密钥签发",
      keysTitle: "凭证账本",
      models: "路由面板",
      modelsTitle: "已发布模型航线",
    },
    labels: {
      name: "名称",
      status: "状态",
      quota: "配额",
      rpm: "RPM",
      tpm: "TPM",
      tenant: "租户",
      lastUsed: "最近使用",
      fingerprint: "指纹",
      publicModel: "公开模型",
      externalModel: "上游模型",
      priority: "优先级",
      input: "输入",
      output: "输出",
      region: "区域",
      weight: "权重",
      concurrency: "最大并发",
      never: "从未",
    },
  },
};

export function isSupportedLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

export function getDictionary(locale: Locale): DashboardDictionary {
  return dictionaries[locale];
}
