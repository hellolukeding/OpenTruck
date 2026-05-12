import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import Link from "next/link";
import { isSupportedLocale, type Locale } from "@/lib/i18n";

const models = [
  { name: "gpt-4o", provider: "OpenAI", icon: "smart_toy", type: "LLM", input: "$2.50", output: "$10.00" },
  { name: "gpt-3.5-turbo", provider: "OpenAI", icon: "bolt", type: "LLM", input: "$0.50", output: "$1.50" },
  { name: "claude-3-opus", provider: "Anthropic", icon: "memory", type: "LLM", input: "$15.00", output: "$75.00" },
  { name: "Llama 3 70B", provider: "Meta", icon: "neurology", type: "LLM", input: "$0.70", output: "$0.90" },
  { name: "Mistral Large", provider: "Mistral AI", icon: "cloud", type: "LLM", input: "$4.00", output: "$12.00" },
  { name: "Gemini 1.5 Pro", provider: "Google", icon: "auto_awesome", type: "LLM", input: "$3.50", output: "$10.50" },
  { name: "DeepSeek V3", provider: "DeepSeek", icon: "psychology", type: "LLM", input: "$0.27", output: "$1.10" },
  { name: "Stable Diffusion 3", provider: "Stability AI", icon: "image", type: "Image", input: "$0.03", output: "$0.06" },
];

const features = [
  {
    icon: "lan",
    title: "Unified API Protocol",
    description: "Single OpenAI-compatible endpoint for all LLM providers. Drop-in replacement for any existing integration — no SDK changes required.",
  },
  {
    icon: "hub",
    title: "Decentralized Routing",
    description: "Auto-failover across a global network of nodes. Requests are intelligently routed to the fastest available node with zero downtime.",
  },
  {
    icon: "toll",
    title: "Token Optimization",
    description: "Smart response caching and request batching reduce token consumption by up to 40%. Pay less, infer more.",
  },
  {
    icon: "monitoring",
    title: "Real-time Observability",
    description: "Live dashboards for usage, latency, cost breakdowns, and model performance. Full Prometheus and OpenTelemetry support.",
  },
  {
    icon: "security",
    title: "Enterprise Security",
    description: "End-to-end encryption, API key-based access control, audit logging, and RBAC for multi-tenant deployments.",
  },
  {
    icon: "code",
    title: "Fully Open Source",
    description: "100% open-source under MIT license. Self-host or use our cloud — zero vendor lock-in, full data sovereignty.",
  },
];

const pricingTiers = [
  {
    name: "Developer",
    price: "$0",
    period: "/month",
    description: "For individual developers and small projects",
    features: [
      "100K free tokens per month",
      "Community support (Discord)",
      "50 requests per minute",
      "Access to open models",
      "Basic analytics",
    ],
    cta: "Get Started",
    href: "/en",
    featured: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For production applications and teams",
    features: [
      "10 million tokens included",
      "Priority email support",
      "500 requests per minute",
      "All premium models",
      "Advanced analytics & alerts",
      "99.9% SLA guarantee",
    ],
    cta: "Start Free Trial",
    href: "/en",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale deployments",
    features: [
      "Volume pricing discounts",
      "24/7 dedicated support",
      "Unlimited requests",
      "Dedicated nodes available",
      "Custom contract & invoicing",
      "On-premise deployment option",
    ],
    cta: "Contact Sales",
    href: "/en",
    featured: false,
  },
];

const landingCopy = {
  en: {
    navModels: "Models",
    navPricing: "Pricing",
    navDocs: "API Docs",
    navConsole: "Console",
    heroTitle: "Open source decentralized API transfer station",
    heroSummary:
      "A high-performance conduit for intelligence distribution. Streamline your API access with enterprise-grade reliability and zero cognitive noise.",
    heroSearchPlaceholder: "Search models or providers...",
    heroCta: "Get API Key",
  },
  "zh-CN": {
    navModels: "模型",
    navPricing: "价格",
    navDocs: "API 文档",
    navConsole: "控制台",
    heroTitle: "开源去中心化 API 中转站",
    heroSummary:
      "一个为智能分发而设计的高性能传输层，用更稳定、更低噪音的方式统一你的 API 接入。",
    heroSearchPlaceholder: "搜索模型或提供商...",
    heroCta: "获取 API Key",
  },
} satisfies Record<
  Locale,
  {
    navModels: string;
    navPricing: string;
    navDocs: string;
    navConsole: string;
    heroTitle: string;
    heroSummary: string;
    heroSearchPlaceholder: string;
    heroCta: string;
  }
>;

export default async function LandingPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const requestedLocale = resolvedSearchParams?.lang;
  const locale: Locale =
    requestedLocale && isSupportedLocale(requestedLocale)
      ? requestedLocale
      : "en";
  const copy = landingCopy[locale];
  const consoleHref = `/${locale}`;

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant">
        <div className="flex items-center justify-between px-md md:px-xl h-16 max-w-container-max mx-auto">
          <div className="flex items-center gap-xl">
            <img
              src="/logo.png"
              alt="OpenTruck"
              className="h-8 w-auto"
            />
            <div className="hidden md:flex items-center gap-lg">
              <a className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors" href="#models">{copy.navModels}</a>
              <a className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors" href="#pricing">{copy.navPricing}</a>
              <a className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors" href="#endpoints">{copy.navDocs}</a>
              <Link className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors" href={consoleHref}>{copy.navConsole}</Link>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <ThemeToggle />
            <LocaleSwitcher
              locale={locale}
              localizedHrefs={{
                en: "/",
                "zh-CN": "/?lang=zh-CN",
              }}
            />
            <Link
              href={consoleHref}
              className="ml-sm bg-primary text-on-primary text-label-md font-label-md px-md py-sm hover:bg-primary-container hover:text-on-primary-container transition-colors rounded-lg"
            >
              {copy.navConsole}
            </Link>
            <UserMenu />
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center pt-16">
        {/* Hero Section */}
        <section className="w-full max-w-container-max px-md md:px-xl py-xxl flex flex-col items-center text-center mt-xl">
          <div className="inline-flex items-center gap-xs px-md py-xs border border-outline-variant rounded-full mb-lg text-code-sm font-code-sm text-on-surface-variant bg-surface-container-low">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed" />
            v0.1.0 — Open source and production ready
          </div>
          <h1 className="font-display text-display text-primary mb-md max-w-3xl">
            {copy.heroTitle}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-xl">
            {copy.heroSummary}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-md w-full max-w-xl">
            <div className="flex-grow w-full flex items-center border border-outline-variant bg-surface-container-lowest px-md py-sm focus-within:border-primary transition-colors rounded-lg">
              <span className="material-symbols-outlined text-on-surface-variant mr-sm text-[18px]">search</span>
              <input
                className="w-full bg-transparent border-none text-body-md font-body-md focus:outline-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant h-10 p-0"
                placeholder={copy.heroSearchPlaceholder}
                type="text"
              />
            </div>
            <Link
              href={consoleHref}
              className="w-full sm:w-auto bg-primary text-on-primary text-label-md font-label-md px-lg py-sm h-12 flex items-center justify-center gap-xs hover:bg-primary-container hover:text-on-primary-container transition-colors whitespace-nowrap rounded-lg"
            >
              <span className="material-symbols-outlined text-[18px]">key</span>
              {copy.heroCta}
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full max-w-container-max px-md md:px-xl py-lg mb-xl">
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

        {/* Features Grid */}
        <section className="w-full max-w-container-max px-md md:px-xl mb-xxl">
          <div className="flex flex-col items-center text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">
              Why OpenTruck?
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Everything you need to route, monitor, and optimize your AI infrastructure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border border-outline-variant bg-surface-container-lowest p-lg flex flex-col gap-md hover:bg-surface-bright transition-colors rounded-xl"
              >
                <div className="w-10 h-10 bg-surface-container flex items-center justify-center border border-outline-variant rounded-lg">
                  <span className="material-symbols-outlined text-primary text-[20px]">{feature.icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary">
                  {feature.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant flex-1">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full max-w-container-max px-md md:px-xl mb-xxl">
          <div className="flex flex-col items-center text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">
              How It Works
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Three steps to connect your application to the decentralized network.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter relative">
            {[
              {
                step: "01",
                icon: "key",
                title: "Get API Key",
                description: "Sign up for an account and generate your API key. No credit card required to start.",
              },
              {
                step: "02",
                icon: "settings_ethernet",
                title: "Configure Endpoint",
                description: "Point your application to our OpenAI-compatible endpoint. Works with any existing SDK.",
              },
              {
                step: "03",
                icon: "rocket_launch",
                title: "Route Requests",
                description: "Send requests and let our network route them to the fastest, most cost-effective node.",
              },
            ].map((step, index) => (
              <div key={step.step} className="flex flex-col items-center text-center relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px border-t border-dashed border-outline-variant" />
                )}
                <div className="w-24 h-24 bg-surface-container border border-outline-variant flex items-center justify-center mb-md rounded-xl">
                  <span className="material-symbols-outlined text-primary text-[32px]">{step.icon}</span>
                </div>
                <span className="font-code-sm text-code-sm text-on-surface-variant mb-xs">{step.step}</span>
                <h3 className="font-headline-md text-headline-md text-primary mb-sm">{step.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full max-w-container-max px-md md:px-xl mb-xxl">
          <div className="flex flex-col items-center text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">
              Intelligence Pricing
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Transparent, zero-markup pricing. Pay only for the compute you use.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`border p-lg flex flex-col gap-md rounded-xl ${tier.featured
                    ? "border-primary bg-surface-container border-2 relative"
                    : "border-outline-variant bg-surface-container-lowest"
                  }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-code-sm font-code-sm px-md py-0.5 rounded-full">
                    RECOMMENDED
                  </span>
                )}
                <div className="flex flex-col gap-xs">
                  <h3 className="font-headline-md text-headline-md text-primary">{tier.name}</h3>
                  <div className="flex items-baseline gap-xs">
                    <span className="font-display text-display text-primary">{tier.price}</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">{tier.period}</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">{tier.description}</p>
                </div>
                <ul className="flex flex-col gap-sm flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-sm font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-secondary-fixed text-[16px]">check</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`text-center text-label-md font-label-md px-md py-sm transition-colors rounded-lg ${tier.featured
                      ? "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container"
                      : "bg-surface text-primary border border-primary hover:bg-surface-container"
                    }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-lg">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Network base rate: <span className="text-primary font-medium">$0.0002 / 1K tokens</span> &mdash; Average latency: <span className="text-primary font-medium">~45ms</span>
            </p>
          </div>
        </section>

        {/* Configuration & Endpoints */}
        <section id="endpoints" className="w-full max-w-container-max px-md md:px-xl mb-xxl grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          <div className="border border-outline-variant bg-surface-container-lowest p-lg flex flex-col rounded-xl">
            <h3 className="font-headline-md text-headline-md text-primary mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined">api</span>
              Endpoints
            </h3>
            <div className="space-y-md flex-grow">
              <div className="flex flex-col border border-outline-variant overflow-hidden rounded-lg">
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
              <div className="flex flex-col border border-outline-variant overflow-hidden rounded-lg">
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
          <div className="border border-outline-variant bg-primary-container p-lg flex flex-col relative overflow-hidden rounded-xl">
            <div className="absolute top-0 left-0 w-full h-8 bg-inverse-surface border-b border-on-primary-fixed-variant flex items-center px-sm gap-xs rounded-t-xl">
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
                  &quot;model&quot;: &quot;gpt-4o&quot;,
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

        {/* API Documentation Preview */}
        <section className="w-full max-w-container-max px-md md:px-xl mb-xxl">
          <div className="flex flex-col items-center text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">
              API Reference
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              OpenAI-compatible, zero learning curve. Just change the base URL and start routing.
            </p>
          </div>
          <div className="max-w-3xl mx-auto border border-outline-variant bg-surface-container-lowest p-lg rounded-xl">
            <div className="flex items-center gap-sm mb-lg pb-lg border-b border-outline-variant">
              <span className="bg-secondary-fixed text-on-secondary-fixed text-code-sm font-code-sm px-md py-0.5 rounded-md">POST</span>
              <code className="text-code-sm font-code-sm text-primary">https://api.opentruck.network/v1/chat/completions</code>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div>
                <h4 className="font-label-md text-label-md text-primary mb-md">Request Body</h4>
                <div className="flex flex-col gap-sm">
                  {[
                    { field: "model", type: "string", required: true, desc: "Model ID to use" },
                    { field: "messages", type: "array", required: true, desc: "Chat messages" },
                    { field: "temperature", type: "number", required: false, desc: "Sampling temperature (0-2)" },
                    { field: "stream", type: "boolean", required: false, desc: "Stream partial responses" },
                  ].map((param) => (
                    <div key={param.field} className="flex flex-col border border-outline-variant p-sm rounded-md">
                      <div className="flex items-center gap-sm">
                        <code className="text-code-sm font-code-sm text-primary">{param.field}</code>
                        <span className="text-code-sm text-code-sm text-on-surface-variant">{param.type}</span>
                        {param.required && (
                          <span className="text-code-sm text-code-sm text-secondary-fixed">required</span>
                        )}
                      </div>
                      <span className="font-body-md text-body-md text-on-surface-variant">{param.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-outline-variant bg-inverse-surface p-md rounded-lg">
                <h4 className="font-label-md text-label-md text-inverse-on-surface mb-md">Quick Start</h4>
                <pre className="text-code-sm font-code-sm text-inverse-on-surface leading-relaxed">
                  <span className="text-secondary-fixed">curl</span> https://api.opentruck.network/v1/models {'\\'}
                  <span className="text-tertiary-fixed-dim">-H</span> <span className="text-error-container">&quot;Authorization: Bearer $OPENAI_API_KEY&quot;</span>
                </pre>
              </div>
            </div>
            <div className="mt-lg pt-lg border-t border-outline-variant text-center">
              <Link
                href="/en"
                className="text-label-md font-label-md text-primary hover:underline inline-flex items-center gap-xs"
              >
                View full API documentation
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
            {models.map((model) => (
              <div
                key={model.name}
                className="border border-outline-variant bg-surface-container-lowest p-md flex flex-col gap-md hover:bg-surface-bright transition-colors cursor-pointer rounded-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-sm">
                    <div className="w-8 h-8 bg-surface-variant flex items-center justify-center rounded-lg">
                      <span className="material-symbols-outlined text-primary text-[18px]">{model.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md text-primary">{model.name}</h4>
                      <span className="font-code-sm text-code-sm text-on-surface-variant">{model.provider}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 bg-surface-variant text-code-sm font-code-sm text-on-surface rounded-md">
                    <span className="w-2 h-2 rounded-full bg-secondary-fixed mr-xs" />
                    {model.type}
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

        {/* CTA Section */}
        <section className="w-full max-w-container-max px-md md:px-xl mb-xxl">
          <div className="border border-outline-variant bg-surface-container-lowest p-xl flex flex-col items-center text-center gap-lg rounded-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Ready to build?
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
              Join the network. Get your API key and start routing requests in under five minutes.
            </p>
            <div className="flex items-center gap-md">
              <Link
                href="/en"
                className="bg-primary text-on-primary text-label-md font-label-md px-lg py-sm hover:bg-primary-container hover:text-on-primary-container transition-colors rounded-lg"
              >
                Get API Key
              </Link>
              <Link
                href="#endpoints"
                className="bg-surface text-primary border border-primary text-label-md font-label-md px-lg py-sm hover:bg-surface-container transition-colors rounded-lg"
              >
                Read the Docs
              </Link>
            </div>
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
