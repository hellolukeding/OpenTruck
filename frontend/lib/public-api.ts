export type PublicLeaderboardEntry = {
  rank: number;
  model: string;
  category: string;
  provider: string;
  merchant_count: number;
  availability_rate: string;
  request_count: number;
  total_tokens: number;
  avg_price_per_m_tokens: string;
  latest_request_at: string | null;
  score: string;
};

export type PublicLeaderboardResponse = {
  items: PublicLeaderboardEntry[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL ?? "http://127.0.0.1:8000";

export async function getPublicLeaderboard(query: {
  window?: string;
  category?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}) {
  const params = new URLSearchParams();
  if (query.window) params.set("window", query.window);
  if (query.category) params.set("category", query.category);
  if (query.search) params.set("search", query.search);
  if (query.sortBy) params.set("sort_by", query.sortBy);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("page_size", String(query.pageSize));
  const response = await fetch(`${BACKEND_BASE_URL}/leaderboard?${params.toString()}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to fetch leaderboard: ${response.status}`);
  return (await response.json()) as PublicLeaderboardResponse;
}
