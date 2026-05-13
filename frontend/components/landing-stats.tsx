const stats = [
  { icon: "hub", label: "Active Nodes", value: "12,842" },
  { icon: "bolt", label: "Avg Latency", value: "42ms" },
  { icon: "verified_user", label: "Uptime", value: "99.998%" },
  { icon: "account_balance_wallet", label: "Cost Savings", value: "~40%" },
];

export function LandingStats() {
  return (
    <section className="px-gutter max-w-container-max mx-auto mb-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-xl hover:-translate-y-1 transition-transform"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">{stat.icon}</span>
              </div>
              <span className="font-label-md text-label-md text-secondary">{stat.label}</span>
            </div>
            <div className="font-display text-headline-md font-bold text-on-surface">{stat.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
