import { Megaphone } from "lucide-react";

type Props = {
  title: string;
  chip: string;
  items: string[];
};

export function AdminOverviewNotices({ title, chip, items }: Props) {
  return (
    <section className="rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest shadow-sm dark:bg-surface-container-low/60">
      <div className="flex items-center gap-3 border-b border-outline-variant/10 px-5 py-4">
        <Megaphone className="h-5 w-5 text-on-surface" />
        <h2 className="text-[1.25rem] font-semibold text-on-surface">{title}</h2>
        <span className="rounded-full border border-outline-variant/20 bg-surface-container-low px-3 py-1 text-[0.76rem] text-on-surface-variant">
          {chip}
        </span>
      </div>
      <div className="space-y-0">
        {items.map((item, index) => (
          <article
            key={`${index}-${item.slice(0, 12)}`}
            className="border-t border-outline-variant/10 px-5 py-5 first:border-t-0"
          >
            <div className="flex gap-3">
              <span className="mt-1 h-3 w-3 rounded-full bg-[#64748b]" />
              <div>
                <p className="text-[0.86rem] text-on-surface-variant">
                  {index + 1} 周前 2026-05-0{Math.min(index + 3, 9)} 19:16
                </p>
                <p className="mt-2 text-[1rem] leading-8 text-on-surface">{item}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
