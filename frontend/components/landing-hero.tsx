import { TerminalBlock } from "@/components/terminal-block";

export function LandingHero() {
  return (
    <section className="relative px-gutter max-w-container-max mx-auto mb-20 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50 -z-10" />
      <div className="flex flex-col md:flex-row items-center gap-12 py-12">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/10 text-primary border border-primary-container/20 rounded-full font-label-md text-label-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Network Status: Live
          </div>
          <h1 className="font-display text-display max-w-2xl text-on-surface leading-tight">
            Global High-Performance{" "}
            <span className="text-primary">AI Inference</span> Market
          </h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-xl">
            A decentralized, high-availability transfer station for LLMs. Access unified
            APIs from 500+ global nodes with millisecond latency and tiered pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="relative flex-grow max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md"
                placeholder="Search models or providers..."
                type="text"
              />
            </div>
            <button className="px-8 py-3 bg-primary text-on-primary font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all">
              Get API Key
            </button>
          </div>
        </div>
        <div className="flex-1 w-full max-w-xl">
          <TerminalBlock>
            <span className="text-primary-fixed">const</span> client ={" "}
            <span className="text-primary-fixed">new</span> OpenTruck({"\n"}
            {"  "}apiKey: <span className="text-tertiary-container">&apos;TRUCK_SK_832...&apos;</span>,{`\n`}
            {"  "}baseURL: <span className="text-tertiary-container">&apos;https://api.opentruck.ai/v1&apos;</span>{`\n`});
            {`\n`}
            <span className="text-secondary-fixed">/* Request intelligent routing */</span>
            {`\n`}
            <span className="text-primary-fixed">const</span> response ={" "}
            <span className="text-primary-fixed">await</span> client.chat.completions.create({"{"}
            {"\n"}  {"  "}model: <span className="text-tertiary-container">&quot;gpt-4-turbo&quot;</span>,{`\n`}
            {"  "}messages: [{"{ "}role:{" "}
            <span className="text-tertiary-container">&quot;user&quot;</span>, content:{" "}
            <span className="text-tertiary-container">&quot;Synthesize data...&quot;</span>{" "}
            {"}"}]{`\n`});
          </TerminalBlock>
        </div>
      </div>
    </section>
  );
}
