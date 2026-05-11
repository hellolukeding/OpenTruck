export const SUPPORTED_LOCALES = ["en", "zh-CN"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export type DashboardDictionary = {
  languageLabel: string;
  languages: Record<Locale, string>;
  nav: {
    overview: string;
    tenants: string;
    nodes: string;
    apiKeys: string;
    models: string;
  };
  shell: {
    brandTitle: string;
    brandSummary: string;
  };
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
  overview: {
    signalLabel: string;
    signalTitle: string;
    signalSummary: string;
    snapshotEyebrow: string;
    snapshotTitle: string;
    ledgerEyebrow: string;
    ledgerTitle: string;
  };
  resources: {
    tenants: {
      eyebrow: string;
      title: string;
      description: string;
      empty: string;
      noteTitle: string;
      noteBody: string;
      summary: {
        count: string;
        countNote: string;
        active: string;
        activeNote: string;
        balance: string;
        balanceNote: string;
      };
    };
    nodes: {
      eyebrow: string;
      title: string;
      description: string;
      empty: string;
      noteTitle: string;
      noteBody: string;
      summary: {
        count: string;
        countNote: string;
        healthy: string;
        healthyNote: string;
        capacity: string;
        capacityNote: string;
      };
    };
    apiKeys: {
      eyebrow: string;
      title: string;
      description: string;
      empty: string;
      noteTitle: string;
      noteBody: string;
      summary: {
        count: string;
        countNote: string;
        active: string;
        activeNote: string;
        recent: string;
        recentNote: string;
      };
    };
    models: {
      eyebrow: string;
      title: string;
      description: string;
      empty: string;
      noteTitle: string;
      noteBody: string;
      summary: {
        count: string;
        countNote: string;
        publicModels: string;
        publicModelsNote: string;
        active: string;
        activeNote: string;
      };
    };
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
    pricing: string;
    never: string;
  };
};

const dictionaries: Record<Locale, DashboardDictionary> = {
  en: {
    languageLabel: "Language",
    languages: { en: "English", "zh-CN": "简体中文" },
    nav: {
      overview: "Overview",
      tenants: "Tenants",
      nodes: "Nodes",
      apiKeys: "API Keys",
      models: "Models",
    },
    shell: {
      brandTitle: "Relay desk",
      brandSummary:
        "A monochrome operations surface for the OpenTruck control plane, tuned for routing, allocation, and key issuance.",
    },
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
    overview: {
      signalLabel: "Relay signal",
      signalTitle: "Control bandwidth before it turns into chaos.",
      signalSummary:
        "The overview page stays biased toward live operational shape: active keys, healthy nodes, and published routes.",
      snapshotEyebrow: "Node snapshot",
      snapshotTitle: "Current upstream convoy",
      ledgerEyebrow: "Credential ledger",
      ledgerTitle: "Recently issued access",
    },
    resources: {
      tenants: {
        eyebrow: "Tenant registry",
        title: "Keep quota ownership legible.",
        description:
          "Each tenant represents a commercial or internal budget domain. This page highlights quota pressure and per-tenant rate ceilings.",
        empty: "No tenants registered yet.",
        noteTitle: "Reading guide",
        noteBody:
          "Tenants anchor balance ownership. As write actions arrive, this page can grow into the main place for credit adjustments and throttling policy.",
        summary: {
          count: "Tenant count",
          countNote: "Registered ownership domains",
          active: "Active tenants",
          activeNote: "Currently allowed to issue traffic",
          balance: "Quota balance",
          balanceNote: "Aggregate remaining balance",
        },
      },
      nodes: {
        eyebrow: "Node convoy",
        title: "Track upstream capacity lane by lane.",
        description:
          "Nodes are your executable supply chain. This page compresses region, health, and concurrency into one routing-focused surface.",
        empty: "No nodes configured yet.",
        noteTitle: "Routing note",
        noteBody:
          "Healthy node count and concurrency are the fastest signal for whether the relay can absorb burst traffic without queue collapse.",
        summary: {
          count: "Node count",
          countNote: "Registered upstream endpoints",
          healthy: "Healthy nodes",
          healthyNote: "Reported with health_status=ok",
          capacity: "Max concurrency",
          capacityNote: "Summed declared concurrency ceiling",
        },
      },
      apiKeys: {
        eyebrow: "Credential ledger",
        title: "Audit access like issued instruments.",
        description:
          "API keys are presented as a ledger instead of decorative cards, so fingerprint, tenant affinity, and recency stay scannable.",
        empty: "No API keys issued yet.",
        noteTitle: "Storage note",
        noteBody:
          "The backend stores only SHA-256 hashes. This surface intentionally shows fingerprints rather than raw secrets.",
        summary: {
          count: "Issued keys",
          countNote: "Total records in circulation",
          active: "Active keys",
          activeNote: "Ready to authorize requests",
          recent: "Recently used",
          recentNote: "Keys with at least one usage timestamp",
        },
      },
      models: {
        eyebrow: "Routing surface",
        title: "Publish model lanes with pricing discipline.",
        description:
          "Model mappings decide what the public API exposes. The view emphasizes public model names, upstream bindings, and pricing shape.",
        empty: "No public model mappings yet.",
        noteTitle: "Exposure note",
        noteBody:
          "Once write flows arrive, this page becomes the primary guardrail for public model naming, fallback layering, and margin control.",
        summary: {
          count: "Model routes",
          countNote: "Total mapping records",
          publicModels: "Public models",
          publicModelsNote: "Distinct names exposed to clients",
          active: "Active routes",
          activeNote: "Mappings available for routing",
        },
      },
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
      pricing: "Pricing",
      never: "Never",
    },
  },
  "zh-CN": {
    languageLabel: "语言",
    languages: { en: "English", "zh-CN": "简体中文" },
    nav: {
      overview: "总览",
      tenants: "租户",
      nodes: "节点",
      apiKeys: "API 密钥",
      models: "模型",
    },
    shell: {
      brandTitle: "调度席",
      brandSummary:
        "这是 OpenTruck 控制面的黑白运营界面，重点围绕路由、配额分配和密钥签发，不做装饰型后台。",
    },
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
    overview: {
      signalLabel: "调度信号",
      signalTitle: "先控制带宽，再谈规模。",
      signalSummary:
        "总览页优先展示真正影响运行面的指标，比如活跃密钥、健康节点和已发布路由，而不是花哨的装饰统计。",
      snapshotEyebrow: "节点快照",
      snapshotTitle: "当前上游编队",
      ledgerEyebrow: "凭证账本",
      ledgerTitle: "最近签发访问凭证",
    },
    resources: {
      tenants: {
        eyebrow: "租户登记",
        title: "让配额归属保持清晰可读。",
        description:
          "每个租户都代表一个商业或内部预算域。这个页面重点展示配额压力和每个租户的速率上限。",
        empty: "当前还没有租户记录。",
        noteTitle: "阅读说明",
        noteBody:
          "租户是余额归属的锚点。后续接入写操作后，这里会自然演进为调额和限流策略的主操作面。",
        summary: {
          count: "租户数量",
          countNote: "已登记的归属域",
          active: "活跃租户",
          activeNote: "当前允许发起流量",
          balance: "配额余额",
          balanceNote: "全局剩余余额汇总",
        },
      },
      nodes: {
        eyebrow: "节点编队",
        title: "按航道跟踪上游容量。",
        description:
          "节点就是你的可执行供应链。这个页面把地域、健康度和并发能力压缩进一个偏路由的观察面。",
        empty: "当前还没有配置节点。",
        noteTitle: "路由说明",
        noteBody:
          "健康节点数量和并发总量，是判断中转层能否承受突发流量而不出现排队塌陷的最快信号。",
        summary: {
          count: "节点数量",
          countNote: "已登记上游端点",
          healthy: "健康节点",
          healthyNote: "health_status=ok 的节点",
          capacity: "最大并发",
          capacityNote: "声明并发上限求和",
        },
      },
      apiKeys: {
        eyebrow: "密钥账本",
        title: "像管理已签发票据一样审计访问凭证。",
        description:
          "API 密钥被组织成账本视图，而不是装饰性卡片，这样指纹、租户归属和最近使用情况能更快扫读。",
        empty: "当前还没有签发 API 密钥。",
        noteTitle: "存储说明",
        noteBody:
          "后端只保存 SHA-256 哈希值。这里刻意展示指纹，而不会回显原始密钥。",
        summary: {
          count: "已签发密钥",
          countNote: "当前流通中的总记录数",
          active: "活跃密钥",
          activeNote: "可以继续授权请求",
          recent: "近期使用",
          recentNote: "至少出现过一次使用时间戳的密钥",
        },
      },
      models: {
        eyebrow: "路由面板",
        title: "带着价格纪律发布模型航线。",
        description:
          "模型映射决定公开 API 暴露什么能力。这个页面重点强调公开模型名、上游绑定关系和定价结构。",
        empty: "当前还没有公开模型映射。",
        noteTitle: "暴露说明",
        noteBody:
          "当写操作接进来之后，这里会成为控制公开模型命名、回退层级和利润空间的主界面。",
        summary: {
          count: "模型路由",
          countNote: "全部映射记录数",
          publicModels: "公开模型",
          publicModelsNote: "对外暴露的去重模型名",
          active: "活跃路由",
          activeNote: "当前可参与调度的映射",
        },
      },
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
      pricing: "定价",
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
