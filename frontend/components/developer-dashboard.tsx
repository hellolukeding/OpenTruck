"use client";

const barHeights = [40, 60, 30, 80, 95, 100];

export function DeveloperStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
      <div className="bg-white p-lg rounded-xl border border-outline-variant/30 airy-shadow hover:-translate-y-0.5 transition-transform">
        <div className="flex justify-between items-start mb-base">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Total Requests</span>
          <span className="material-symbols-outlined text-primary-container">insights</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-headline-lg">1,284,502</span>
          <span className="font-label-md text-label-md text-primary">+12.4%</span>
        </div>
        <div className="mt-md h-12 flex items-end gap-1">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-sm ${i === barHeights.length - 1 ? "bg-primary-container" : "bg-surface-container-highest"}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      <div className="bg-white p-lg rounded-xl border border-outline-variant/30 airy-shadow hover:-translate-y-0.5 transition-transform">
        <div className="flex justify-between items-start mb-base">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Estimated Cost</span>
          <span className="material-symbols-outlined text-on-secondary-container">payments</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-headline-lg">$412.80</span>
          <span className="font-label-md text-label-md text-on-secondary-container-dim">USD</span>
        </div>
        <p className="mt-md font-body-sm text-body-sm text-secondary">Projected monthly spend: $1,650.00</p>
        <div className="w-full bg-surface-container h-1.5 rounded-full mt-sm overflow-hidden">
          <div className="bg-on-surface h-full w-2/3 rounded-full" />
        </div>
      </div>

      <div className="bg-white p-lg rounded-xl border border-outline-variant/30 airy-shadow hover:-translate-y-0.5 transition-transform">
        <div className="flex justify-between items-start mb-base">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Remaining Credit</span>
          <span className="material-symbols-outlined text-tertiary">account_balance_wallet</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-headline-lg">$2,587.20</span>
          <span className="font-label-md text-label-md text-secondary">45 days left</span>
        </div>
        <div className="mt-md flex items-center justify-between gap-4">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container" />
            <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-variant" />
          </div>
          <button className="font-label-md text-label-md text-primary font-bold hover:underline">Refill Balance</button>
        </div>
      </div>
    </div>
  );
}

export function DeveloperUsageChart() {
  const days = [
    { label: "Mon", bars: [45], highlight: false },
    { label: "Tue", bars: [65], highlight: false },
    { label: "Wed", bars: [55], highlight: false },
    { label: "Thu", bars: [85], highlight: false },
    { label: "Fri", bars: [70], highlight: false },
    { label: "Sat", bars: [95, 5], highlight: false },
    { label: "Today", bars: [80], highlight: true },
  ];

  return (
    <div className="bg-white border border-outline-variant/30 rounded-xl airy-shadow overflow-hidden">
      <div className="px-lg py-md border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
        <h3 className="font-headline-md text-body-lg font-bold">API Usage Volume</h3>
        <div className="flex gap-md">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-on-surface rounded-full" />
            <span className="font-label-md text-label-md text-secondary">Successful</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-tertiary-container rounded-full" />
            <span className="font-label-md text-label-md text-secondary">Failed</span>
          </div>
        </div>
      </div>
      <div className="p-lg">
        <div className="h-64 flex items-end justify-between gap-4 px-md">
          {days.map((day) => (
            <div key={day.label} className="flex-1 flex flex-col justify-end items-center group">
              {day.bars.map((h, i) => (
                <div
                  key={i}
                  className={`w-full rounded-t transition-all group-hover:bg-primary mt-0.5 ${
                    i === 0 && day.highlight ? "bg-primary" : i > 0 ? "bg-tertiary-container" : "bg-on-surface"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
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
