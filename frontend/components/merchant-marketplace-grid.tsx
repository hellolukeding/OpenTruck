const merchants = [
  {
    name: "NeuroFlow Systems",
    handle: "@neuroflow_ai",
    description:
      "提供高性能 Claude 3.5 与 GPT-4o 算力集群，独享 10Gbps 带宽，端到端延迟低至 120ms。",
    availability: "99.98%",
    rating: "4.92",
    models: "24 个活跃模型",
    followers: "+12k",
    accent: "from-[#cce9e4] to-[#c9efe8]",
    mark: "◎",
  },
  {
    name: "ByteForge Cloud",
    handle: "@byteforge",
    description:
      "专注开源 LLM 推理优化。Llama、Qwen、DeepSeek 全系列适配，秒级响应，支持量化推理。",
    availability: "99.85%",
    rating: "4.88",
    models: "15 个活跃模型",
    followers: "+5k",
    accent: "from-[#f2e5e8] to-[#f5dfe5]",
    mark: "▣",
  },
  {
    name: "HyperScale Tech",
    handle: "@hyperscale_api",
    description:
      "全球分布式边缘算力，极速 API 路由转发，确保您的业务在任何地区都能获得一致的高速度响应。",
    availability: "99.70%",
    rating: "4.75",
    models: "42 个活跃模型",
    followers: "+8k",
    accent: "from-[#dfdddf] to-[#ebe9ec]",
    mark: "◉",
  },
  {
    name: "Apex Compute",
    handle: "@apex_compute",
    description:
      "企业级算力网关，支持动态负载均衡。提供超高 QPS 限制的独占通道与定制化 SLA。",
    availability: "99.95%",
    rating: "4.95",
    models: "8 个活跃模型",
    followers: "+1k",
    accent: "from-[#66f0bf] to-[#b1f1d7]",
    mark: "⬢",
  },
  {
    name: "GlobalNode AI",
    handle: "@global_nodes",
    description:
      "通过去中心化节点提供弹性算力。最实惠的 GPT-3.5 替代方案，覆盖欧美与亚太多区域。",
    availability: "98.20%",
    rating: "4.40",
    models: "64 个活跃模型",
    followers: "+20k",
    accent: "from-[#bce8de] to-[#d6ebec]",
    mark: "◌",
  },
  {
    name: "Obsidian AI",
    handle: "@obsidian_core",
    description:
      "专注图像生成模型 Midjourney 与 Stable Diffusion API，提供高并发推理队列与私有通道。",
    availability: "99.90%",
    rating: "4.85",
    models: "12 个活跃模型",
    followers: "+3k",
    accent: "from-[#dfdee2] to-[#ecebf0]",
    mark: "⬡",
  },
];

function AvatarStack({ followers }: { followers: string }) {
  return (
    <div className="flex items-center">
      {["from-[#0f172a] to-[#334155]", "from-[#1f2937] to-[#059669]", "from-[#111827] to-[#64748b]"].map(
        (gradient, index) => (
          <div
            key={gradient}
            className={`-ml-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br ${gradient} text-[9px] font-semibold text-white first:ml-0`}
          >
            {index + 1}
          </div>
        ),
      )}
      <span className="ml-2 rounded-full bg-[#eff0f5] px-2 py-1 text-xs font-medium text-[#4f5753]">
        {followers}
      </span>
    </div>
  );
}

function MerchantCard({
  name,
  handle,
  description,
  availability,
  rating,
  models,
  followers,
  accent,
  mark,
}: (typeof merchants)[number]) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-[#d5d4dc] bg-white shadow-[0_10px_40px_rgba(28,33,42,0.06)]">
      <div className={`h-[88px] bg-gradient-to-r ${accent}`} />
      <div className="px-6 pb-6">
        <div className="-mt-8 mb-4 flex items-start justify-between gap-4">
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] border-4 border-white bg-[#0a0d0f] text-[24px] text-[#54f3c7] shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
            {mark}
          </div>
          <button
            type="button"
            className="mt-7 rounded-xl bg-[#006c49] px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            订阅
          </button>
        </div>

        <div className="border-b border-[#e3e1e8] pb-5">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-[1.1rem] font-semibold tracking-[-0.02em] text-[#17191f]">{name}</h3>
            <span className="text-[#006c49]">✿</span>
          </div>
          <p className="mb-3 font-mono text-[0.92rem] text-[#66716c]">{handle}</p>
          <p className="min-h-[72px] text-[14px] leading-8 text-[#47514c]">{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-5 border-b border-[#e3e1e8] py-4">
          <div>
            <p className="mb-1 text-sm text-[#74807a]">可用性</p>
            <p className="flex items-center gap-2 text-[1.05rem] font-semibold text-[#17191f]">
              <span className={`h-2.5 w-2.5 rounded-full ${availability === "98.20%" ? "bg-red-500" : "bg-emerald-400"}`} />
              {availability}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-[#74807a]">综合评分</p>
            <p className="text-[1.05rem] font-semibold text-[#17191f]">☆ {rating}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <AvatarStack followers={followers} />
          <p className="flex items-center gap-2 text-sm text-[#66716c]">
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
            {models}
          </p>
        </div>
      </div>
    </article>
  );
}

export function MerchantMarketplaceGrid() {
  return (
    <>
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {merchants.map((merchant) => (
          <MerchantCard key={merchant.name} {...merchant} />
        ))}
      </section>

      <div className="flex items-center justify-center gap-3 py-10">
        {["chevron_left", "1", "2", "3", "…", "12", "chevron_right"].map((item) => {
          const icon = item.startsWith("chevron");
          const active = item === "1";
          return (
            <button
              key={item}
              type="button"
              className={`flex h-11 min-w-11 items-center justify-center rounded-xl border px-4 text-base transition-colors ${
                active
                  ? "border-[#006c49] bg-[#006c49] text-white"
                  : "border-[#d5d4dc] bg-white text-[#66716c] hover:border-[#006c49]/40 hover:text-[#006c49]"
              } ${item === "…" ? "pointer-events-none border-transparent bg-transparent" : ""}`}
            >
              {icon ? <span className="material-symbols-outlined text-[20px]">{item}</span> : item}
            </button>
          );
        })}
      </div>
    </>
  );
}
