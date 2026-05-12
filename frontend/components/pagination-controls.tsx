import Link from "next/link";

import type { PaginationMeta } from "@/lib/admin-api";

type PaginationControlsProps = {
  locale: "en" | "zh-CN";
  path: string;
  pagination: PaginationMeta;
  query?: Record<string, string | undefined>;
};

function buildHref(
  path: string,
  query: Record<string, string | undefined>,
  page: number,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value) {
      params.set(key, value);
    }
  }

  params.set("page", String(page));
  return `${path}?${params.toString()}`;
}

export function PaginationControls({
  locale,
  path,
  pagination,
  query = {},
}: PaginationControlsProps) {
  if (pagination.total_pages <= 1) {
    return null;
  }

  const copy =
    locale === "zh-CN"
      ? {
          previous: "上一页",
          next: "下一页",
          page: `第 ${pagination.page} / ${pagination.total_pages} 页`,
          total: `共 ${pagination.total} 条`,
        }
      : {
          previous: "Previous",
          next: "Next",
          page: `Page ${pagination.page} of ${pagination.total_pages}`,
          total: `${pagination.total} total items`,
        };

  const previousPage = Math.max(1, pagination.page - 1);
  const nextPage = Math.min(pagination.total_pages, pagination.page + 1);

  return (
    <div className="flex flex-col gap-sm rounded-2xl border border-outline-variant bg-surface px-md py-sm md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col">
        <span className="font-label-md text-label-md text-primary">{copy.page}</span>
        <span className="font-code-sm text-code-sm text-on-surface-variant">{copy.total}</span>
      </div>
      <div className="flex items-center gap-sm">
        <Link
          aria-disabled={pagination.page <= 1}
          href={buildHref(path, query, previousPage)}
          className="inline-flex items-center justify-center rounded-lg border border-outline-variant px-md py-sm text-label-md font-label-md text-on-surface transition-colors hover:border-primary hover:text-primary aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          {copy.previous}
        </Link>
        <Link
          aria-disabled={pagination.page >= pagination.total_pages}
          href={buildHref(path, query, nextPage)}
          className="inline-flex items-center justify-center rounded-lg border border-outline-variant px-md py-sm text-label-md font-label-md text-on-surface transition-colors hover:border-primary hover:text-primary aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          {copy.next}
        </Link>
      </div>
    </div>
  );
}
