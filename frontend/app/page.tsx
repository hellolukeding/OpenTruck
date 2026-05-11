import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant">
        <div className="flex items-center justify-between px-md md:px-xl h-16 max-w-container-max mx-auto">
          <div className="flex items-center gap-xl">
            <span className="font-headline-md font-bold tracking-tight text-primary">
              OpenTruck
            </span>
            <div className="hidden md:flex items-center gap-lg">
              <a className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors" href="#models">Models</a>
              <a className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors" href="#endpoints">API Docs</a>
              <Link className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors" href="/en">Console</Link>
            </div>
          </div>
          <Link
            href="/en"
            className="bg-primary text-on-primary text-label-md font-label-md px-md py-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
          >
            Console
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center pt-16">
        {/* Hero Section */}
        <section className="w-full max-w-container-max px-md md:px-xl py-xxl flex flex-col items-center text-center mt-xl">
          <h1 className="font-display text-display text-primary mb-md max-w-3xl">
            Open source decentralized API transfer station
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-xl">
            A high-performance conduit for intelligence distribution. Streamline your API access with
            enterprise-grade reliability and zero cognitive noise.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-md w-full max-w-xl">
            <div className="flex-grow w-full flex items-center border border-outline-variant bg-surface-container-lowest px-md py-sm focus-within:border-primary transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant mr-sm text-[18px]">search</span>
              <input
                className="w-full bg-transparent border-none text-body-md font-body-md focus:outline-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant h-10 p-0"
                placeholder="Search models or providers..."
                type="text"
              />
            </div>
            <Link
              href="/en"
              className="w-full sm:w-auto bg-primary text-on-primary text-label-md font-label-md px-lg py-sm h-12 flex items-center justify-center gap-xs hover:bg-primary-container hover:text-on-primary-container transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">key</span>
              Get API Key
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full max-w-container-max px-md md:px-xl py-lg mb-xxl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg border-y border-outline-variant py-xl">
            <div className="flex flex-col items-center text-center">
              <span className="font-headline-lg text-headline-lg text-primary">586+</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant mt-xs">
                Available Models
              </span>
            </div>
            <div className="flex flex-col items-center text-center border-t md:border-t-0 md:border-l border-outline-variant pt-lg md:pt-0 md:pl-lg">
              <span className="font-headline-lg text-headline-lg text-primary">96+</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant mt-xs">
                Active Nodes
              </span>
            </div>
            <div className="flex flex-col items-center text-center border-t md:border-t-0 md:border-l border-outline-variant pt-lg md:pt-0 md:pl-lg">
              <span className="font-headline-lg text-headline-lg text-primary">99.9%</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant mt-xs">
                Uptime Guarantee
              </span>
            </div>
          </div>
        </section>

        {/* Configuration & Endpoints */}
        <section id="endpoints" className="w-full max-w-container-max px-md md:px-xl mb-xxl grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          <div className="border border-outline-variant bg-surface-container-lowest p-lg flex flex-col">
            <h3 className="font-headline-md text-headline-md text-primary mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined">api</span>
              Endpoints
            </h3>
            <div className="space-y-md flex-grow">
              <div className="flex flex-col border border-outline-variant overflow-hidden">
                <div className="bg-surface-variant px-sm py-xs text-code-sm font-code-sm text-on-surface-variant border-b border-outline-variant">
                  Global Access
                </div>
                <div className="flex items-center justify-between px-md py-sm bg-surface-container-lowest">
                  <code className="text-code-sm font-code-sm text-primary">
                    https://api.opentruck.network/v1
                  </code>
                  <button className="text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col border border-outline-variant overflow-hidden">
                <div className="bg-surface-variant px-sm py-xs text-code-sm font-code-sm text-on-surface-variant border-b border-outline-variant">
                  Direct Node
                </div>
                <div className="flex items-center justify-between px-md py-sm bg-surface-container-lowest">
                  <code className="text-code-sm font-code-sm text-primary">
                    https://node.us-east.opentruck.network/v1
                  </code>
                  <button className="text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Showcase */}
          <div className="border border-outline-variant bg-primary-container p-lg flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-8 bg-inverse-surface border-b border-on-primary-fixed-variant flex items-center px-sm gap-xs">
              <div className="w-3 h-3 rounded-full bg-error" />
              <div className="w-3 h-3 rounded-full bg-tertiary-fixed-dim" />
              <div className="w-3 h-3 rounded-full bg-secondary-fixed" />
            </div>
            <div className="pt-xl overflow-x-auto">
              <pre className="text-code-sm font-code-sm text-on-primary leading-relaxed">
                <span className="text-secondary-fixed-dim">curl</span> https://api.opentruck.network/v1/chat/completions {'\\'}
                <span className="text-tertiary-fixed-dim">  -H</span> <span className="text-error-container">&quot;Content-Type: application/json&quot;</span> {'\\'}
                <span className="text-tertiary-fixed-dim">  -H</span> <span className="text-error-container">&quot;Authorization: Bearer sk-your-api-key&quot;</span> {'\\'}
                <span className="text-tertiary-fixed-dim">  -d</span> <span className="text-error-container">&apos;{`{`}
    &quot;model&quot;: &quot;gpt-4&quot;,
    &quot;messages&quot;: [
      {`{`}
        &quot;role&quot;: &quot;user&quot;,
        &quot;content&quot;: &quot;Initialize transfer protocol.&quot;
      {`}`}
    ]
  {`}`}&apos;</span>
              </pre>
            </div>
          </div>
        </section>

        {/* Model Directory */}
        <section id="models" className="w-full max-w-container-max px-md md:px-xl mb-xxl">
          <div className="flex items-center justify-between mb-lg border-b border-outline-variant pb-sm">
            <h2 className="font-headline-md text-headline-md text-primary">Model Directory</h2>
            <Link className="text-label-md text-secondary font-label-md hover:underline flex items-center gap-xs" href="/en/models">
              View All
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {[
              { name: "gpt-4", provider: "OpenAI", icon: "smart_toy", input: "$0.03", output: "$0.06" },
              { name: "gpt-3.5-turbo", provider: "OpenAI", icon: "bolt", input: "$0.0005", output: "$0.0015" },
              { name: "claude-3-opus", provider: "Anthropic", icon: "memory", input: "$15.00", output: "$75.00" },
            ].map((model) => (
              <div
                key={model.name}
                className="border border-outline-variant bg-surface-container-lowest p-md flex flex-col gap-md hover:bg-surface-bright transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-sm">
                    <div className="w-8 h-8 bg-surface-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[18px]">{model.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md text-primary">{model.name}</h4>
                      <span className="font-code-sm text-code-sm text-on-surface-variant">{model.provider}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 bg-surface-variant text-code-sm font-code-sm text-on-surface">
                    <span className="w-2 h-2 rounded-full bg-secondary-fixed mr-xs" />
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-end border-t border-outline-variant pt-sm mt-auto">
                  <div className="flex flex-col">
                    <span className="font-code-sm text-code-sm text-on-surface-variant">Input</span>
                    <span className="font-body-md text-body-md text-primary">{model.input} / 1K</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-code-sm text-code-sm text-on-surface-variant">Output</span>
                    <span className="font-body-md text-body-md text-primary">{model.output} / 1K</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface w-full py-xl px-md md:px-xl max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-md border-t border-outline-variant mt-auto">
        <div className="flex items-center gap-sm">
          <span className="font-label-md font-bold text-primary">OpenTruck</span>
          <span className="font-body-md text-body-md text-on-surface-variant">
            &copy; 2024 OpenTruck. Decentralized API Protocol.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-md justify-center">
          <a className="font-code-sm text-code-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Documentation</a>
          <a className="font-code-sm text-code-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-code-sm text-code-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Service Terms</a>
          <a className="font-code-sm text-code-sm text-on-surface-variant hover:text-primary transition-colors" href="#">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
