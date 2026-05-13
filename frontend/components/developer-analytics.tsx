"use client";

const activeKeys = [
  { name: "Production-Cluster-A", prefix: "tk_82k", suffix: "92xs", lastUsed: "2 mins ago", status: "Active" as const },
  { name: "Staging-Sandbox", prefix: "tk_j2l", suffix: "45pq", lastUsed: "12 hours ago", status: "Active" as const },
  { name: "Legacy-V1-Key", prefix: "tk_f8m", suffix: "11zz", lastUsed: "3 days ago", status: "Inactive" as const },
];

const topModels = [
  { name: "GPT-4 Turbo (Legacy)", usage: "428k req", fill: 85, color: "bg-on-surface" },
  { name: "GPT-5 Omni (Active)", usage: "312k req", fill: 62, color: "bg-primary-container" },
  { name: "Claude 3.5 Sonnet", usage: "195k req", fill: 38, color: "bg-on-surface" },
  { name: "Mistral Large", usage: "44k req", fill: 12, color: "bg-on-surface" },
];

export function DeveloperApiKeys() {
  return (
    <div className="bg-white border border-outline-variant/30 rounded-xl airy-shadow flex flex-col">
      <div className="px-lg py-md border-b border-outline-variant/30 flex items-center justify-between">
        <h3 className="font-headline-md text-body-lg font-bold">Active API Keys</h3>
        <button className="font-label-md text-label-md text-primary">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-body-sm">
          <thead className="bg-surface-container-low text-on-surface-variant/70 border-b border-outline-variant/10 uppercase tracking-tighter text-[11px]">
            <tr>
              <th className="px-lg py-3 font-bold">Name</th>
              <th className="px-lg py-3 font-bold">Last Used</th>
              <th className="px-lg py-3 font-bold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {activeKeys.map((key) => (
              <tr key={key.name} className="hover:bg-surface-container transition-colors">
                <td className="px-lg py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface">{key.name}</span>
                    <span className="text-secondary font-code-md">{key.prefix}...{key.suffix}</span>
                  </div>
                </td>
                <td className="px-lg py-4 text-on-surface-variant">{key.lastUsed}</td>
                <td className="px-lg py-4 text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                    key.status === "Active"
                      ? "bg-primary-container/10 text-primary"
                      : "bg-surface-container-highest text-secondary"
                  }`}>
                    {key.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DeveloperTopModels() {
  return (
    <div className="bg-white border border-outline-variant/30 rounded-xl airy-shadow p-lg">
      <div className="flex items-center justify-between mb-lg">
        <h3 className="font-headline-md text-body-lg font-bold">Top Models by Usage</h3>
        <button className="material-symbols-outlined text-secondary hover:text-on-surface">more_vert</button>
      </div>
      <div className="space-y-md">
        {topModels.map((m) => (
          <div key={m.name} className="space-y-sm">
            <div className="flex justify-between font-label-md text-label-md">
              <span className="font-bold text-on-surface">{m.name}</span>
              <span className="text-secondary">{m.usage}</span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div className={`${m.color} h-full`} style={{ width: `${m.fill}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-lg p-md bg-surface-container-low rounded-lg flex items-center gap-md">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
        <p className="font-body-sm text-body-sm text-on-secondary-container">
          You are currently using 85% of your <span className="font-bold">Pro Plan</span> quota. Consider upgrading to avoid rate limiting.
        </p>
      </div>
    </div>
  );
}
