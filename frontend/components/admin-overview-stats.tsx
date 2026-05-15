import type { LucideIcon } from "lucide-react";

type StatCard = {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
  action?: string;
};

export function AdminOverviewStats({ stats }: { stats: StatCard[] }) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest shadow-sm dark:bg-surface-container-low/60">
      <div className="grid grid-cols-2 divide-x divide-y divide-outline-variant/10 md:grid-cols-4 xl:grid-cols-8 xl:divide-y-0">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex min-h-[128px] flex-col items-center justify-center px-5 py-7 text-center"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low ${stat.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-[0.86rem] text-on-surface-variant">{stat.label}</p>
              <p className="mt-2 text-[0.95rem] font-semibold text-on-surface md:text-[1rem]">
                {stat.value}
              </p>
              {stat.action ? (
                <button className="mt-3 rounded-full border border-outline-variant/20 bg-surface px-3 py-1 text-[0.76rem] font-medium text-on-surface shadow-sm dark:bg-surface-container-low">
                  {stat.action}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
