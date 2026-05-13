"use client";

export function MerchantSubNav() {
  const tabs = [
    { label: "OpenTruck 智能路由", icon: "bolt", active: true },
    { label: "总览", icon: "grid_view" },
    { label: "令牌", icon: "key" },
    { label: "钱包", icon: "account_balance_wallet" },
    { label: "日志", icon: "article" },
    { label: "工单", icon: "support_agent" },
    { label: "设置", icon: "settings" },
  ];

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-xs bg-surface-container p-xs rounded-full overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`flex items-center gap-sm px-lg py-sm rounded-full whitespace-nowrap transition-colors font-body-md ${
              tab.active
                ? "bg-primary-container text-on-primary-container font-medium"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span className="text-body-md">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function MerchantHero() {
  return (
    <section className="bg-primary-container rounded-xl overflow-hidden text-on-primary-container shadow-sm border border-outline-variant/30 relative">
      <div className="absolute top-0 right-0 p-lg">
        <button className="flex items-center gap-xs bg-white/20 hover:bg-white/30 transition-colors px-md py-sm rounded-lg text-body-sm font-medium">
          <span className="material-symbols-outlined text-[18px]">add</span>
          创建 OpenTruck Key
        </button>
      </div>
      <div className="p-lg pt-xl">
        <div className="flex items-center gap-sm mb-xs">
          <span className="material-symbols-outlined text-display">bolt</span>
          <h1 className="text-headline-lg font-headline-lg">OpenTruck</h1>
        </div>
        <p className="text-body-md opacity-90">自动路由到最优商家，故障自动切换</p>
      </div>
      <div className="grid grid-cols-3 border-t border-white/20">
        <div className="p-lg text-center border-r border-white/20">
          <p className="text-label-md uppercase tracking-wider mb-xs opacity-80">API Keys</p>
          <p className="text-display leading-none">1</p>
        </div>
        <div className="p-lg text-center border-r border-white/20">
          <p className="text-label-md uppercase tracking-wider mb-xs opacity-80">已启用</p>
          <p className="text-display leading-none">1</p>
        </div>
        <div className="p-lg text-center">
          <p className="text-label-md uppercase tracking-wider mb-xs opacity-80">可用模型</p>
          <p className="text-display leading-none">4</p>
        </div>
      </div>
    </section>
  );
}

export function MerchantKeysCard() {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
      <div className="px-lg py-md flex items-center justify-between border-b border-outline-variant/20">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">key</span>
          <h2 className="text-headline-md font-headline-md">OpenTruck Keys</h2>
        </div>
        <button className="flex items-center gap-xs border border-outline-variant/50 hover:bg-surface-container-low transition-colors px-md py-sm rounded-lg text-body-sm">
          <span className="material-symbols-outlined text-[18px]">add</span>
          新建
        </button>
      </div>
      <div className="p-lg">
        <div className="border border-outline-variant/30 rounded-xl p-lg bg-surface hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-md">
            <div className="space-y-sm">
              <div className="flex items-center gap-md">
                <span className="font-headline-md text-headline-md">codex</span>
                <span className="bg-blue-100 text-blue-600 px-sm py-xs rounded text-label-md">opentruck</span>
                <span className="bg-emerald-100 text-emerald-600 px-sm py-xs rounded text-label-md flex items-center gap-xs">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  已启用
                </span>
                <span className="text-on-surface-variant text-body-sm">无限额度</span>
              </div>
              <p className="text-on-surface-variant text-body-sm font-medium">gpt-5.4</p>
            </div>
            <div className="flex items-center gap-sm text-on-surface-variant">
              <button className="p-sm hover:bg-surface-container rounded-lg transition-colors"><span className="material-symbols-outlined">edit</span></button>
              <button className="p-sm hover:bg-surface-container rounded-lg transition-colors"><span className="material-symbols-outlined">delete</span></button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-xl bg-surface-container-low px-md py-sm rounded-lg border border-outline-variant/20 mb-sm">
            <code className="font-code-md text-code-md tracking-wider">sk-p4Ej***********98cR</code>
            <div className="flex items-center gap-md">
              <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors text-[20px]">visibility</button>
              <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors text-[20px]">content_copy</button>
            </div>
          </div>
          <p className="text-on-surface-variant text-body-sm opacity-60">永不过期</p>
        </div>
      </div>
    </section>
  );
}

export function MerchantBookmarks() {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
      <div className="px-lg py-md flex items-center justify-between border-b border-outline-variant/20">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">storefront</span>
          <h2 className="text-headline-md font-headline-md">已收藏商家 <span className="text-secondary ml-xs">1</span></h2>
        </div>
        <a className="text-primary hover:underline text-body-sm flex items-center gap-xs" href="#">
          浏览商家
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        </a>
      </div>
      <div className="p-lg">
        <div className="inline-flex items-center gap-md bg-surface-container-low p-md rounded-xl border border-outline-variant/20 group">
          <div className="w-10 h-10 rounded-full bg-white border border-outline-variant/20 flex items-center justify-center text-label-md font-bold text-primary">
            A
          </div>
          <span className="font-headline-md text-body-lg">A A A Souimagery</span>
          <button className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity ml-md">close</button>
        </div>
      </div>
    </section>
  );
}

const modelGroups = [
  {
    category: "Chat", count: 3,
    models: [
      { name: "gpt-5.3-codex", price: "$0.06/M", merchants: "1 个商家提供", free: false },
      { name: "gpt-5.4", price: "$0.07/M", merchants: "1 个商家提供", free: false },
      { name: "gpt-5.5", price: "$0.12/M", merchants: "1 个商家提供", free: false },
    ],
  },
  {
    category: "completion", count: 1,
    models: [
      { name: "gpt-5.4-mini", price: "免费/M", merchants: "1 个商家提供", free: true },
    ],
  },
];

export function MerchantModelsTable() {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
      <div className="px-lg py-md flex items-center gap-sm border-b border-outline-variant/20">
        <span className="material-symbols-outlined text-primary">model_training</span>
        <h2 className="text-headline-md font-headline-md">可用模型 <span className="text-secondary ml-xs">4</span></h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-left">
              <th className="px-lg py-sm text-label-md text-secondary uppercase tracking-wider font-medium">Model Name</th>
              <th className="px-lg py-sm text-label-md text-secondary uppercase tracking-wider font-medium text-right">Status / Pricing</th>
              <th className="px-lg py-sm text-label-md text-secondary uppercase tracking-wider font-medium text-right">Merchants</th>
            </tr>
          </thead>
          <tbody className="text-body-md">
            {modelGroups.map((group) => (
              <tr key={group.category}>
                <td colSpan={3}>
                  <table className="w-full">
                    <tbody>
                      <tr className="bg-surface-container-lowest border-b border-outline-variant/10">
                        <td className="px-lg py-sm font-bold text-primary" colSpan={3}>
                          {group.category}
                          <span className="text-label-md font-normal text-secondary ml-sm">{group.count}</span>
                        </td>
                      </tr>
                      {group.models.map((model) => (
                        <tr key={model.name} className="hover:bg-surface-container-low transition-colors border-b border-outline-variant/10">
                          <td className="px-lg py-md">{model.name}</td>
                          <td className="px-lg py-md text-right">
                            <span className="text-secondary mr-sm">最低价格:</span>
                            <span className={model.free ? "text-emerald-500 font-bold" : "text-primary font-bold"}>{model.price}</span>
                          </td>
                          <td className="px-lg py-md text-right text-on-surface-variant">{model.merchants}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
