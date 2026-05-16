"use client";

import Link from "next/link";

import type { DashboardNotice } from "@/lib/admin-console-api";

export function DeveloperToolbar({
  locale,
  logsHref,
  newKeyHref,
  notices,
}: {
  locale: string;
  logsHref: string;
  newKeyHref: string;
  notices: DashboardNotice[];
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/30 bg-white/70 px-gutter backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 md:hidden">
          <span className="material-symbols-outlined font-bold text-primary">terminal</span>
        </div>
        <form action={logsHref} className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">
            search
          </span>
          <input
            className="w-64 rounded-lg border border-outline-variant bg-surface-container-low py-1.5 pl-10 pr-4 text-body-sm font-body-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:w-96"
            name="search"
            placeholder="Search usage, keys, or endpoints..."
            type="text"
          />
        </form>
      </div>
      <div className="flex items-center gap-md">
        <details className="group relative">
          <summary className="relative list-none cursor-pointer p-2 text-on-surface-variant transition-colors hover:text-primary">
            <span className="material-symbols-outlined">notifications</span>
            {notices.length > 0 ? <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error" /> : null}
          </summary>
          <div className="absolute right-0 mt-2 w-[22rem] overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
            <div className="flex items-center justify-between border-b border-outline-variant/10 px-4 py-3">
              <div>
                <p className="text-[0.95rem] font-semibold text-on-surface">系统公告</p>
                <p className="text-[0.78rem] text-on-surface-variant">最新平台通知与维护消息</p>
              </div>
              <Link className="text-[0.8rem] font-medium text-primary hover:underline" href={`/${locale}/announcements`}>
                查看全部
              </Link>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notices.length > 0 ? (
                notices.slice(0, 5).map((notice) => (
                  <Link
                    key={notice.id}
                    className="block border-t border-outline-variant/10 px-4 py-3 first:border-t-0 hover:bg-surface-container-low"
                    href={`/${locale}/announcements`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${severityTone(notice.severity)}`} />
                      <p className="text-[0.86rem] font-semibold text-on-surface">{notice.title}</p>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[0.8rem] text-on-surface-variant">{notice.body}</p>
                    <p className="mt-2 text-[0.72rem] text-on-surface-variant">{formatDate(notice.created_at)}</p>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-[0.84rem] text-on-surface-variant">暂无通知</div>
              )}
            </div>
          </div>
        </details>
        <Link
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-1.5 text-label-md font-label-md text-on-primary transition-all hover:bg-surface-tint active:scale-95"
          href={newKeyHref}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Generate New Key</span>
        </Link>
      </div>
    </header>
  );
}

function severityTone(severity: string) {
  if (severity === "critical") return "bg-error";
  if (severity === "warning") return "bg-[#f59e0b]";
  return "bg-primary";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
