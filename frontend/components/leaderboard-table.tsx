const models = [
  {
    rank: 1, name: "gpt-5.4-omni", provider: "OpenAI Central · 缓存命中率 88.2%",
    category: "chat", color: "bg-brand-50", icon: "text-primary",
    iconSvg: <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />,
    availability: "99.8%", availabilityColor: "text-brand-600",
    calls: "1,208.9K", barHeights: [50, 75, 100], barColor: "bg-brand-500",
    tokens: "24.6B", lastCall: "刚刚", stars: 5, priceCny: "¥0.45", priceUsd: "$0.062",
  },
  {
    rank: 2, name: "claude-3.5-sonnet", provider: "Anthropic High-Speed · 命中率 94.5%",
    category: "chat", color: "bg-purple-50", icon: "text-purple-600",
    iconSvg: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />,
    availability: "99.5%", availabilityColor: "text-brand-600",
    calls: "942.4M", barHeights: [100, 75, 50], barColor: "bg-brand-500",
    tokens: "18.2B", lastCall: "2分钟前", stars: 5, priceCny: "¥0.75", priceUsd: "$0.104",
  },
  {
    rank: 3, name: "llama-3-70b-pro", provider: "Groq Localhost · 命中率 37.8%",
    category: "completion", color: "bg-slate-100", icon: "text-slate-600",
    iconSvg: <path d="M13 10V3L4 14h7v7l9-11h-7z" />,
    availability: "100.0%", availabilityColor: "text-brand-600",
    calls: "785.1M", barHeights: [25, 50, 100], barColor: "bg-brand-500",
    tokens: "9.1B", lastCall: "14分钟前", stars: 3, partialStars: 2, priceCny: "¥0.15", priceUsd: "$0.021",
  },
  {
    rank: 4, name: "gemini-1.5-pro", provider: "Google Cloud · 命中率 74.2%",
    category: "chat", color: "bg-green-50", icon: "",
    iconContent: "G3",
    availability: "92.4%", availabilityColor: "text-orange-500",
    calls: "696.1M", barHeights: [], barColor: "bg-brand-500",
    tokens: "7.4B", lastCall: "1小时前", stars: 4, priceCny: "¥0.55", priceUsd: "$0.076",
  },
  {
    rank: 5, name: "mistral-large-2407", provider: "",
    category: "chat", color: "", icon: "",
    availability: "98.9%", availabilityColor: "text-brand-600",
    calls: "522.2M", tokens: "5.0B", lastCall: "刚刚", stars: 4, priceCny: "¥0.44", priceUsd: "",
    barHeights: [], barColor: "bg-brand-500",
  },
  {
    rank: 6, name: "text-embedding-3-small", provider: "",
    category: "embedding", color: "", icon: "",
    availability: "99.9%", availabilityColor: "text-brand-600",
    calls: "412.1M", tokens: "12.5B", lastCall: "5秒前", stars: 5, priceCny: "¥0.01", priceUsd: "",
    barHeights: [], barColor: "bg-brand-500",
  },
];

const categoryColors: Record<string, string> = {
  chat: "bg-blue-50 text-blue-600",
  completion: "bg-slate-100 text-slate-600",
  embedding: "bg-purple-50 text-purple-600",
  image: "bg-pink-50 text-pink-600",
  audio: "bg-amber-50 text-amber-600",
};

const categoryLabels: Record<string, string> = {
  chat: "chat",
  completion: "completion",
  embedding: "embedding",
  image: "image",
  audio: "audio",
};

function StarRating({ filled, partial }: { filled: number; partial?: number }) {
  return (
    <div className="flex text-amber-400">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? "" : partial && i < filled + partial ? "text-amber-400" : "text-slate-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function LeaderboardTable() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">#</th>
            <th className="px-6 py-4">模型名称</th>
            <th className="px-6 py-4">分类</th>
            <th className="px-6 py-4">可用性</th>
            <th className="px-6 py-4">调用量 (24h)</th>
            <th className="px-6 py-4">Token 消耗</th>
            <th className="px-6 py-4">最近调用</th>
            <th className="px-6 py-4">评分</th>
            <th className="px-6 py-4 text-right">价格 (1M Tokens)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {models.map((m) => (
            <tr key={m.rank} className="transition-colors hover:bg-[rgba(16,185,129,0.03)]">
              <td className="px-6 py-4 font-medium text-slate-400">{m.rank}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {m.iconSvg || m.iconContent ? (
                    <div className={`w-8 h-8 ${m.color || "bg-slate-100"} rounded flex items-center justify-center`}>
                      {m.iconSvg ? (
                        <svg className={`w-4 h-4 ${m.icon}`} fill="currentColor" viewBox="0 0 24 24">{m.iconSvg}</svg>
                      ) : (
                        <span className="text-xs font-bold text-green-600">{m.iconContent}</span>
                      )}
                    </div>
                  ) : null}
                  <div>
                    <div className="font-bold text-slate-900">{m.name}</div>
                    {m.provider && <div className="text-[10px] text-slate-400 uppercase tracking-tighter">{m.provider}</div>}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${categoryColors[m.category] || "bg-slate-100 text-slate-600"}`}>
                  {categoryLabels[m.category] || m.category}
                </span>
              </td>
              <td className={`px-6 py-4 font-bold ${m.availabilityColor || "text-brand-600"}`}>{m.availability}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{m.calls}</span>
                  {m.barHeights && m.barHeights.length > 0 && (
                    <div className="flex items-end gap-0.5 h-3">
                      {m.barHeights.map((h, i) => (
                        <div key={i} className={`w-1 ${m.barColor} rounded-t`} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 font-medium">{m.tokens}</td>
              <td className="px-6 py-4 text-slate-500">{m.lastCall}</td>
              <td className="px-6 py-4"><StarRating filled={m.stars} partial={m.partialStars} /></td>
              <td className="px-6 py-4 text-right">
                <div className="font-semibold text-slate-900">{m.priceCny}</div>
                {m.priceUsd && <div className="text-[10px] text-slate-400">{m.priceUsd}</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="text-sm text-slate-500">显示 1 到 10，共 542 个模型</div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-400 disabled:opacity-50" disabled>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          </button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center text-sm font-bold bg-brand-500 text-white rounded-md">1</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md">2</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md">3</button>
            <span className="px-2 text-slate-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md">55</button>
          </div>
          <button className="p-2 border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
