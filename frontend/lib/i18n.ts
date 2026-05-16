export const SUPPORTED_LOCALES = ["en", "zh-CN"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export type DashboardDictionary = {
  languageLabel: string;
  languages: Record<Locale, string>;
  status: {
    active: string;
    paused: string;
    disabled: string;
    ok: string;
    unknown: string;
    degraded: string;
    down: string;
    error: string;
  };
  nav: {
    overview: string;
    tenants: string;
    nodes: string;
    apiKeys: string;
    wallet: string;
    announcements: string;
    logs: string;
    tickets: string;
    models: string;
    upstreamAccounts: string;
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
  forms: {
    common: {
      submitting: string;
    };
    tenants: {
      eyebrow: string;
      title: string;
      description: string;
      submit: string;
      messages: {
        success: string;
      };
    };
    nodes: {
      eyebrow: string;
      title: string;
      description: string;
      submit: string;
      tagsPlaceholder: string;
      messages: {
        success: string;
      };
    };
    apiKeys: {
      eyebrow: string;
      title: string;
      description: string;
      submit: string;
      selectTenant: string;
      scopePlaceholder: string;
      messages: {
        success: string;
      };
    };
    models: {
      eyebrow: string;
      title: string;
      description: string;
      submit: string;
      selectNode: string;
      messages: {
        success: string;
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
    rawKey: string;
    scope: string;
    node: string;
    publicModel: string;
    externalModel: string;
    priority: string;
    input: string;
    output: string;
    region: string;
    weight: string;
    concurrency: string;
    baseUrl: string;
    authType: string;
    health: string;
    tags: string;
    pricing: string;
    never: string;
  };
};

const dictionaries: Record<Locale, DashboardDictionary> = {
  en: {
    languageLabel: "Language",
    languages: { en: "English", "zh-CN": "简体中文" },
    status: {
      active: "Active",
      paused: "Paused",
      disabled: "Disabled",
      ok: "OK",
      unknown: "Unknown",
      degraded: "Degraded",
      down: "Down",
      error: "Error",
    },
    nav: {
      overview: "Overview",
      tenants: "Tenants",
      nodes: "Nodes",
      apiKeys: "API Keys",
      wallet: "Wallet",
      announcements: "Notices",
      logs: "Logs",
      tickets: "Tickets",
      models: "Models",
      upstreamAccounts: "Upstream Accounts",
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
    forms: {
      common: {
        submitting: "Submitting...",
      },
      tenants: {
        eyebrow: "Create tenant",
        title: "Register a new quota owner.",
        description:
          "Add a tenant before issuing keys or assigning budget. This is the smallest writable control-plane unit.",
        submit: "Create tenant",
        messages: {
          success: "Tenant created successfully.",
        },
      },
      nodes: {
        eyebrow: "Register node",
        title: "Bring a new upstream endpoint online.",
        description:
          "Create a node entry with routing metadata so it can later receive model bindings and traffic.",
        submit: "Create node",
        tagsPlaceholder: "priority, external, experimental",
        messages: {
          success: "Node created successfully.",
        },
      },
      apiKeys: {
        eyebrow: "Issue key",
        title: "Create a credential for a tenant.",
        description:
          "The raw key is hashed on the backend. This surface only sends it once and never reads it back.",
        submit: "Create API key",
        selectTenant: "Select a tenant",
        scopePlaceholder: "{\"models\": [\"gpt-4o-mini\"]}",
        messages: {
          success: "API key created successfully.",
        },
      },
      models: {
        eyebrow: "Publish route",
        title: "Bind a public model to a node lane.",
        description:
          "Create a route record that maps the public model name to one upstream model on a selected node.",
        submit: "Create model route",
        selectNode: "Select a node",
        messages: {
          success: "Model route created successfully.",
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
      rawKey: "Raw key",
      scope: "Scope JSON",
      node: "Node",
      publicModel: "Public model",
      externalModel: "External model",
      priority: "Priority",
      input: "Input",
      output: "Output",
      region: "Region",
      weight: "Weight",
      concurrency: "Max concurrency",
      baseUrl: "Base URL",
      authType: "Auth type",
      health: "Health",
      tags: "Tags",
      pricing: "Pricing",
      never: "Never",
    },
  },
  "zh-CN": {
    languageLabel: "语言",
    languages: { en: "English", "zh-CN": "简体中文" },
    status: {
      active: "活跃",
      paused: "暂停",
      disabled: "禁用",
      ok: "正常",
      unknown: "未知",
      degraded: "降级",
      down: "离线",
      error: "错误",
    },
    nav: {
      overview: "总览",
      tenants: "租户",
      nodes: "节点",
      apiKeys: "API 密钥",
      wallet: "钱包",
      announcements: "公告",
      logs: "日志",
      tickets: "工单",
      models: "模型",
      upstreamAccounts: "上游账号",
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
    forms: {
      common: {
        submitting: "提交中...",
      },
      tenants: {
        eyebrow: "创建租户",
        title: "登记一个新的配额归属主体。",
        description:
          "在签发密钥或分配预算之前，先创建租户。它是当前控制面最小的可写业务单元。",
        submit: "创建租户",
        messages: {
          success: "租户创建成功。",
        },
      },
      nodes: {
        eyebrow: "登记节点",
        title: "让新的上游端点接入调度面。",
        description:
          "先写入节点和路由元信息，后续它才能挂接模型映射并接收流量。",
        submit: "创建节点",
        tagsPlaceholder: "priority, external, experimental",
        messages: {
          success: "节点创建成功。",
        },
      },
      apiKeys: {
        eyebrow: "签发密钥",
        title: "为租户创建访问凭证。",
        description:
          "原始密钥只会在提交时发送一次，后端会做哈希处理，前端不会再回读明文。",
        submit: "创建 API 密钥",
        selectTenant: "选择租户",
        scopePlaceholder: "{\"models\": [\"gpt-4o-mini\"]}",
        messages: {
          success: "API 密钥创建成功。",
        },
      },
      models: {
        eyebrow: "发布路由",
        title: "把公开模型绑定到节点航道上。",
        description:
          "这里创建的是模型路由记录，用来把公开模型名映射到某个节点上的实际上游模型。",
        submit: "创建模型路由",
        selectNode: "选择节点",
        messages: {
          success: "模型路由创建成功。",
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
      rawKey: "原始密钥",
      scope: "Scope JSON",
      node: "节点",
      publicModel: "公开模型",
      externalModel: "上游模型",
      priority: "优先级",
      input: "输入",
      output: "输出",
      region: "区域",
      weight: "权重",
      concurrency: "最大并发",
      baseUrl: "基础地址",
      authType: "鉴权类型",
      health: "健康度",
      tags: "标签",
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
