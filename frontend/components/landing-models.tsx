import Link from "next/link";

const featuredModels = [
  {
    name: "GPT-4 Turbo",
    provider: "OpenAI Central",
    icon: "auto_awesome",
    badge: "Active",
    badgeColor: "primary",
    inputPrice: "$0.01",
    outputPrice: "$0.03",
    reliability: 94,
    reliabilityColor: "bg-primary",
  },
  {
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic High-Speed",
    icon: "psychology",
    badge: "Active",
    badgeColor: "primary",
    inputPrice: "$0.003",
    outputPrice: "$0.015",
    reliability: 98,
    reliabilityColor: "bg-primary",
  },
  {
    name: "Llama 3 70B",
    provider: "Groq Localhost",
    icon: "science",
    badge: "Low Latency",
    badgeColor: "tertiary",
    inputPrice: "$0.0007",
    outputPrice: "$0.0009",
    reliability: 89,
    reliabilityColor: "bg-primary",
  },
];

export function LandingModels() {
  return (
    <section className="px-gutter max-w-container-max mx-auto mb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-display text-headline-md mb-2">Top Performing Models</h2>
          <p className="font-body-md text-secondary">Real-time performance and availability leaderboard</p>
        </div>
        <Link href="/models" className="flex items-center gap-2 text-primary font-label-md hover:underline">
          View Full Directory{" "}
          <span className="material-symbols-outlined text-body-sm">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuredModels.map((model) => (
          <div
            key={model.name}
            className="bg-surface-bright border border-outline-variant/50 rounded-xl p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-on-surface rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">{model.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-body-lg">{model.name}</h3>
                  <p className="text-label-md text-secondary font-label-md">{model.provider}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                  model.badgeColor === "primary"
                    ? "bg-primary-container/20 text-primary"
                    : "bg-tertiary-container/20 text-tertiary"
                }`}
              >
                {model.badge}
              </span>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-body-sm">
                <span className="text-secondary">Input (1K)</span>
                <span className="font-bold">{model.inputPrice}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-secondary">Output (1K)</span>
                <span className="font-bold">{model.outputPrice}</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 mt-2">
                <div
                  className={`${model.reliabilityColor} h-1.5 rounded-full`}
                  style={{ width: `${model.reliability}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-secondary">
                <span>Reliability</span>
                <span>{model.reliability}%</span>
              </div>
            </div>
            <button className="w-full py-2 border border-outline-variant group-hover:border-primary group-hover:bg-primary group-hover:text-white rounded-lg transition-all font-label-md">
              Select Model
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
