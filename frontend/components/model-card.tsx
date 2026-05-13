type Props = {
  name: string;
  provider: string;
  icon: string;
  inputPrice: string;
  outputPrice: string;
  latency: string;
};

export function ModelCard({ name, provider, icon, inputPrice, outputPrice, latency }: Props) {
  return (
    <div className="bg-surface-bright border border-outline-variant/30 rounded-xl p-md hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-md">
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {icon}
            </span>
          </div>
          <div>
            <h3 className="font-headline-md text-body-lg font-bold text-on-surface">{name}</h3>
            <p className="font-label-md text-label-md text-outline">{provider}</p>
          </div>
        </div>
        <div className="flex items-center gap-xs px-2 py-1 rounded bg-primary-container/10 border border-primary/20">
          <div className="pulse-dot" />
          <span className="font-label-md text-label-md text-primary uppercase font-bold tracking-wider">
            Active
          </span>
        </div>
      </div>
      <div className="space-y-sm mb-lg">
        <div className="flex justify-between text-body-sm">
          <span className="text-secondary">Input Pricing</span>
          <span className="font-code-md text-code-md text-on-surface">{inputPrice}</span>
        </div>
        <div className="flex justify-between text-body-sm">
          <span className="text-secondary">Output Pricing</span>
          <span className="font-code-md text-code-md text-on-surface">{outputPrice}</span>
        </div>
        <div className="flex justify-between text-body-sm">
          <span className="text-secondary">Latency (avg)</span>
          <span className="font-code-md text-code-md text-primary">{latency}</span>
        </div>
      </div>
      <button className="w-full py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors">
        Deploy Endpoint
      </button>
    </div>
  );
}
