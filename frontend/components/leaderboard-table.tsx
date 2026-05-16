import type { PublicLeaderboardResponse } from "@/lib/public-api";

const categoryColors: Record<string, string> = {
  chat: "bg-blue-50 text-blue-600",
  completion: "bg-slate-100 text-slate-600",
  embedding: "bg-purple-50 text-purple-600",
  image: "bg-pink-50 text-pink-600",
  audio: "bg-amber-50 text-amber-600",
  video: "bg-emerald-50 text-emerald-600",
};

export function LeaderboardTable({
  leaderboard,
  path,
  query,
}: {
  leaderboard: PublicLeaderboardResponse;
  path: string;
  query: { window: string; category?: string; search?: string; sortBy: string };
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[980px]">
        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">#</th>
            <th className="px-6 py-4">模型名称</th>
            <th className="px-6 py-4">分类</th>
            <th className="px-6 py-4">可用性</th>
            <th className="px-6 py-4">调用量</th>
            <th className="px-6 py-4">Token 消耗</th>
            <th className="px-6 py-4">最近调用</th>
            <th className="px-6 py-4">综合分</th>
            <th className="px-6 py-4 text-right">均价 / 1M Tokens</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {leaderboard.items.map((item) => (
            <tr key={`${item.rank}-${item.model}`} className="transition-colors hover:bg-[rgba(16,185,129,0.03)]">
              <td className="px-6 py-4 font-medium text-slate-400">{item.rank}</td>
              <td className="px-6 py-4">
                <div>
                  <div className="font-bold text-slate-900">{item.model}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-tighter">
                    {item.provider} · {item.merchant_count} 个商家
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${categoryColors[item.category] || "bg-slate-100 text-slate-600"}`}>
                  {item.category}
                </span>
              </td>
              <td className="px-6 py-4 font-bold text-emerald-600">{Number(item.availability_rate).toFixed(2)}%</td>
              <td className="px-6 py-4 font-semibold">{formatCompact(item.request_count)}</td>
              <td className="px-6 py-4 font-medium">{formatCompact(item.total_tokens)}</td>
              <td className="px-6 py-4 text-slate-500">{formatTime(item.latest_request_at)}</td>
              <td className="px-6 py-4 font-semibold text-slate-700">{Number(item.score).toFixed(2)}</td>
              <td className="px-6 py-4 text-right font-semibold text-slate-900">¥{Number(item.avg_price_per_m_tokens).toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="text-sm text-slate-500">
          显示 {(leaderboard.page - 1) * leaderboard.page_size + 1} 到{" "}
          {Math.min(leaderboard.page * leaderboard.page_size, leaderboard.total)}，共 {leaderboard.total} 个模型
        </div>
        <div className="flex items-center gap-2">
          <PageLink path={path} query={query} page={Math.max(1, leaderboard.page - 1)} disabled={leaderboard.page <= 1} label="上一页" />
          <span className="px-2 text-sm text-slate-500">
            第 {leaderboard.page} / {Math.max(leaderboard.total_pages, 1)} 页
          </span>
          <PageLink path={path} query={query} page={Math.min(Math.max(leaderboard.total_pages, 1), leaderboard.page + 1)} disabled={leaderboard.page >= leaderboard.total_pages} label="下一页" />
        </div>
      </div>
    </div>
  );
}

function PageLink({
  path,
  query,
  page,
  disabled,
  label,
}: {
  path: string;
  query: { window: string; category?: string; search?: string; sortBy: string };
  page: number;
  disabled: boolean;
  label: string;
}) {
  const params = new URLSearchParams();
  params.set("window", query.window);
  params.set("sort", query.sortBy);
  if (query.category) params.set("category", query.category);
  if (query.search) params.set("search", query.search);
  params.set("page", String(page));
  return (
    <a
      aria-disabled={disabled}
      href={`${path}?${params.toString()}`}
      className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 aria-disabled:pointer-events-none aria-disabled:opacity-40"
    >
      {label}
    </a>
  );
}

function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function formatTime(value: string | null) {
  if (!value) return "暂无";
  return new Date(value).toLocaleString("zh-CN", { hour12: false });
}
