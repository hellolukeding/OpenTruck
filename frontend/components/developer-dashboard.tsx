"use client";

type DeveloperStatCard = {
  title: string;
  value: string;
  accent: string;
  supporting: string;
  icon: string;
  trend?: string;
};

type DeveloperUsageBar = {
  label: string;
  requests: number;
  spend: number;
  highlight?: boolean;
};

export function DeveloperStats({ cards }: { cards: DeveloperStatCard[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white p-lg rounded-xl border border-outline-variant/30 airy-shadow hover:-translate-y-0.5 transition-transform"
        >
          <div className="flex justify-between items-start mb-base">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">{card.title}</span>
            <span className={`material-symbols-outlined ${card.accent}`}>{card.icon}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-headline-lg">{card.value}</span>
            {card.trend ? <span className="font-label-md text-label-md text-primary">{card.trend}</span> : null}
          </div>
          <p className="mt-md font-body-sm text-body-sm text-secondary">{card.supporting}</p>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-sm overflow-hidden">
            <div className={`h-full rounded-full ${card.accent.replace("text-", "bg-")}`} style={{ width: "66%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DeveloperUsageChart({ points }: { points: DeveloperUsageBar[] }) {
  const maxRequests = Math.max(...points.map((day) => day.requests), 1);
  const maxSpend = Math.max(...points.map((day) => day.spend), 1);
  return (
    <div className="bg-white border border-outline-variant/30 rounded-xl airy-shadow overflow-hidden">
      <div className="px-lg py-md border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
        <h3 className="font-headline-md text-body-lg font-bold">API Usage Volume</h3>
        <div className="flex gap-md">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-on-surface rounded-full" />
            <span className="font-label-md text-label-md text-secondary">Requests</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-tertiary-container rounded-full" />
            <span className="font-label-md text-label-md text-secondary">Spend</span>
          </div>
        </div>
      </div>
      <div className="p-lg">
        <div className="h-64 flex items-end justify-between gap-4 px-md">
          {points.map((day) => (
            <div key={day.label} className="flex-1 flex flex-col justify-end items-center group">
              <div
                className={`mt-0.5 w-full rounded-t transition-all group-hover:bg-primary ${
                  day.highlight ? "bg-primary" : "bg-on-surface"
                }`}
                style={{ height: `${Math.max((day.requests / maxRequests) * 100, 8)}%` }}
              />
              <div
                className="mt-0.5 w-full rounded-t bg-tertiary-container transition-all"
                style={{ height: `${Math.max((day.spend / maxSpend) * 28, day.spend > 0 ? 8 : 0)}%` }}
              />
              <span className={`mt-sm font-label-md text-label-md ${day.highlight ? "text-primary font-bold" : "text-secondary"}`}>
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
