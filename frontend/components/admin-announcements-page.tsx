import { Megaphone, Pin } from "lucide-react";

import { AdminAnnouncementForm } from "@/components/admin-announcement-form";
import { AdminAnnouncementRowActions } from "@/components/admin-announcement-row-actions";
import type { Announcement, PaginatedResponse } from "@/lib/admin-console-api";

export function AdminAnnouncementsPage({ announcementsPage }: { announcementsPage: PaginatedResponse<Announcement> }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm dark:bg-surface-container-low/60">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-surface-container-low p-3 text-primary">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[1.55rem] font-semibold text-on-surface">公告管理</h2>
            <p className="mt-1 text-[0.9rem] text-on-surface-variant">集中维护总览公告、运营提醒和状态播报。</p>
          </div>
        </div>
        <div className="mt-6">
          <AdminAnnouncementForm />
        </div>
      </section>

      <section className="rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm dark:bg-surface-container-low/60">
        <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
          <h3 className="text-[1.2rem] font-semibold text-on-surface">当前公告流</h3>
          <span className="rounded-full border border-outline-variant/20 px-3 py-1 text-[0.76rem] text-on-surface-variant">
            共 {announcementsPage.pagination.total} 条
          </span>
        </div>
        <div className="space-y-4 pt-5">
          {announcementsPage.items.map((item) => (
            <article key={item.id} className="rounded-[18px] border border-outline-variant/20 bg-surface px-4 py-4 dark:bg-surface-container-low">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    {item.is_pinned ? <Pin className="h-4 w-4 text-primary" /> : null}
                    <p className="text-[1rem] font-semibold text-on-surface">{item.title}</p>
                  </div>
                  <p className="mt-1 text-[0.78rem] text-on-surface-variant">
                    {item.status} / {item.severity} / {new Date(item.created_at).toLocaleString("zh-CN", { hour12: false })}
                  </p>
                </div>
                <AdminAnnouncementRowActions announcement={item} />
              </div>
              <p className="mt-3 whitespace-pre-wrap text-[0.9rem] leading-7 text-on-surface">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
