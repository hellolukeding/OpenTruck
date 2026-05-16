import { Megaphone } from "lucide-react";

import type { DashboardNotice } from "@/lib/admin-console-api";
import type { OverviewPageCopy } from "@/lib/overview-page-copy";

type Props = {
  copy: OverviewPageCopy["notices"];
  items: DashboardNotice[];
};

export function AdminOverviewNotices({ copy, items }: Props) {
  return (
    <section className="rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest shadow-sm dark:bg-surface-container-low/60">
      <div className="flex items-center gap-3 border-b border-outline-variant/10 px-6 py-5">
        <Megaphone className="h-5 w-5 text-on-surface" />
        <h2 className="text-[1.25rem] font-semibold text-on-surface">{copy.title}</h2>
        <span className="rounded-full border border-outline-variant/20 bg-surface-container-low px-3 py-1 text-[0.76rem] text-on-surface-variant">
          {copy.chip}
        </span>
      </div>
      <div className="space-y-0">
        {items.map((item, index) => (
          <article
            key={item.id}
            className="border-t border-outline-variant/10 px-6 py-6 first:border-t-0"
          >
            <div className="flex gap-3">
              <span className={`mt-1 h-3 w-3 rounded-full ${getDotColor(item.severity)}`} />
              <div>
                <p className="text-[0.86rem] text-on-surface-variant">
                  {item.is_pinned ? copy.pinned : copy.itemNumber(index)} · {formatNoticeTime(copy.dateLocale, item.created_at)}
                </p>
                <p className="mt-2 text-[1rem] font-semibold leading-7 text-on-surface">{item.title}</p>
                <p className="mt-2 text-[0.96rem] leading-8 text-on-surface">{item.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatNoticeTime(locale: string, value: string) {
  return new Date(value).toLocaleString(locale, { hour12: false });
}

function getDotColor(severity: string) {
  if (severity === "success") return "bg-[#059669]";
  if (severity === "warning") return "bg-[#d97706]";
  if (severity === "error") return "bg-[#dc2626]";
  return "bg-[#64748b]";
}
