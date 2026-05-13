import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { ModelCard } from "@/components/model-card";
import { TerminalBlock } from "@/components/terminal-block";

const models = [
  { name: "GPT-4o", provider: "OpenAI", icon: "bolt", inputPrice: "$5.00 / 1M tokens", outputPrice: "$15.00 / 1M tokens", latency: "240ms" },
  { name: "Claude 3.5 Sonnet", provider: "Anthropic", icon: "auto_awesome", inputPrice: "$3.00 / 1M tokens", outputPrice: "$15.00 / 1M tokens", latency: "310ms" },
  { name: "Llama 3 70B", provider: "Meta (Open Source)", icon: "hub", inputPrice: "$0.59 / 1M tokens", outputPrice: "$0.79 / 1M tokens", latency: "180ms" },
  { name: "Mixtral 8x7B", provider: "Mistral AI", icon: "terminal", inputPrice: "$0.25 / 1M tokens", outputPrice: "$0.25 / 1M tokens", latency: "145ms" },
  { name: "Gemini 1.5 Pro", provider: "Google DeepMind", icon: "smart_toy", inputPrice: "$3.50 / 1M tokens", outputPrice: "$10.50 / 1M tokens", latency: "420ms" },
  { name: "GPT-4 Turbo", provider: "OpenAI", icon: "auto_awesome", inputPrice: "$10.00 / 1M tokens", outputPrice: "$30.00 / 1M tokens", latency: "200ms" },
  { name: "Claude 3 Haiku", provider: "Anthropic", icon: "bolt", inputPrice: "$0.25 / 1M tokens", outputPrice: "$1.25 / 1M tokens", latency: "180ms" },
  { name: "DeepSeek V3", provider: "DeepSeek", icon: "psychology", inputPrice: "$0.27 / 1M tokens", outputPrice: "$1.10 / 1M tokens", latency: "220ms" },
];

const filters = ["All Models", "LLM", "Image", "Audio", "Embedding"];

export default function ModelsPage() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      <PublicNav activeId="models" />

      <main className="pt-24 pb-xl px-gutter max-w-container-max mx-auto">
        <section className="mb-xl relative overflow-hidden rounded-xl bg-surface-container-low p-lg grid-pattern">
          <div className="relative z-10">
            <h1 className="font-display text-display text-on-surface mb-sm">Intelligence Models</h1>
            <p className="font-body-lg text-body-lg text-secondary max-w-2xl mb-lg">
              Discover and deploy state-of-the-art AI models. From high-performance LLMs
              to specialized embedding architectures, optimized for the OpenTruck decentralized network.
            </p>
            <div className="flex flex-wrap gap-sm items-center">
              <span className="font-label-md text-label-md text-on-surface-variant mr-base">Filter by:</span>
              {filters.map((f) => (
                <button
                  key={f}
                  className={`px-md py-xs rounded-full font-label-md text-label-md border transition-colors ${
                    f === "All Models"
                      ? "bg-primary-container text-on-primary-container border-primary-container"
                      : "bg-white border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {f}
                </button>
              ))}
              <div className="ml-auto relative flex-1 max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px]">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-lg font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                  placeholder="Search models..."
                  type="text"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {models.map((m) => (
            <ModelCard key={m.name} {...m} />
          ))}
          <div className="bg-white border-2 border-dashed border-outline-variant rounded-xl p-md flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-md group-hover:bg-primary-container/20 group-hover:text-primary transition-colors">
              <span className="material-symbols-outlined">add</span>
            </div>
            <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Deploy Custom Model</h3>
            <p className="font-body-sm text-body-sm text-secondary mt-xs px-lg">
              Upload weights or link your own decentralized compute provider to host private model instances.
            </p>
          </div>
        </div>

        <section className="mt-xl">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">Quick Start</h2>
            <button className="flex items-center gap-xs font-label-md text-label-md text-primary hover:underline">
              <span className="material-symbols-outlined text-[18px]">open_in_new</span> Full Documentation
            </button>
          </div>
          <TerminalBlock>
            <span className="text-primary-container">curl</span> -X POST https://api.opentruck.ai/v1/chat/completions {'\\'}
            {'\n'}  -H <span className="text-tertiary-fixed-dim">&quot;Authorization: Bearer $TRUCK_API_KEY&quot;</span> {'\\'}
            {'\n'}  -H <span className="text-tertiary-fixed-dim">&quot;Content-Type: application/json&quot;</span> {'\\'}
            {'\n'}  -d &apos;&lbrace;{'\n'}
            {'    '}&quot;model&quot;: <span className="text-tertiary-fixed-dim">&quot;gpt-4o&quot;</span>,{'\n'}
            {'    '}&quot;messages&quot;: [&lbrace;{'\n'}
            {'      '}&quot;role&quot;: &quot;user&quot;,&quot;content&quot;: &quot;How does decentralized AI scale?&quot;{'\n'}
            {'    '}&rbrace;]{'\n'}
            {'  '}&apos;
          </TerminalBlock>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
