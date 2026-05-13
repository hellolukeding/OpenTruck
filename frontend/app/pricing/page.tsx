import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

const networkMetrics = [
  { label: "Global Latency", value: "184ms" },
  { label: "Uptime", value: "99.99%" },
  { label: "Nodes Online", value: "4,281" },
  { label: "Throughput", value: "1.2GB/s" },
];

const tiers = [
  {
    name: "Developer",
    price: "$0",
    period: "/mo platform fee",
    description: "Ideal for small projects and solo architects.",
    features: [
      "Shared API gateway access",
      "5 AI models available",
      "Community support",
      "Standard token usage rates",
    ],
    cta: "Get Started",
    featured: false,
    color: "surface",
  },
  {
    name: "Professional",
    price: "$49",
    period: "/mo platform fee",
    description: "Enhanced throughput for scaling applications.",
    features: [
      "Priority routing & lower latency",
      "Unlimited AI model catalog access",
      "15% Discount on token rates",
      "API health monitoring dashboard",
      "Developer chat support",
    ],
    cta: "Select Pro",
    featured: true,
    color: "primary",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Customized solutions for massive scale.",
    features: [
      "Dedicated private node pools",
      "Customized SLAs & uptime guarantees",
      "On-premise deployment options",
      "Whitelabeling & sub-branding",
      "24/7 dedicated account engineer",
    ],
    cta: "Contact Sales",
    featured: false,
    color: "surface",
  },
];

const faqs = [
  {
    q: "How are tokens actually calculated?",
    a: "We follow the standard industry tokenization protocols (OpenAI, Anthropic, etc.). You are billed in real-time based on the cumulative count of input and output tokens across all active models in your stack.",
  },
  {
    q: "Can I switch plans anytime?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and are prorated for the current billing cycle.",
  },
  {
    q: "What happens if my balance runs out?",
    a: "Your service will be paused and you'll receive a notification. You can top up at any time to resume access without data loss.",
  },
  {
    q: "Are there volume discounts for developers?",
    a: "Yes, we offer volume-based pricing for high-usage accounts. Contact our sales team for custom pricing tailored to your usage patterns.",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary-container/30">
      <PublicNav activeId="pricing" />

      <main className="pt-32 pb-xl min-h-screen">
        <section className="max-w-container-max mx-auto px-gutter text-center mb-xl">
          <span className="inline-block px-sm py-xs bg-primary-container/10 text-primary font-label-md text-label-md rounded-lg mb-md">
            Simple & Transparent
          </span>
          <h1 className="font-display text-display text-on-surface mb-md">Intelligence Pricing</h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto">
            Scalable decentralized AI compute that adapts to your workflow. No hidden fees, no lock-ins, just pure performance.
          </p>
        </section>

        <section className="max-w-container-max mx-auto px-gutter mb-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-lg airy-shadow relative overflow-hidden">
              <div className="flex justify-between items-start mb-lg">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Network Pulse</h3>
                  <p className="font-body-sm text-body-sm text-secondary">Real-time aggregate network performance</p>
                </div>
                <div className="flex items-center gap-xs">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-label-md text-label-md text-primary uppercase tracking-wider">Live</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                {networkMetrics.map((m) => (
                  <div key={m.label} className="p-sm bg-surface rounded-lg border border-outline-variant/20">
                    <p className="font-label-md text-label-md text-secondary mb-xs">{m.label}</p>
                    <p className="font-display text-headline-md text-on-surface">{m.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-lg h-32 w-full rounded-lg bg-on-background relative flex items-end px-md pb-xs">
                <div className="flex gap-1 w-full items-end h-full">
                  {[50, 66, 33, 75, 50, 66, 83, 66, 75, 100].map((h, i) => (
                    <div
                      key={i}
                      className="w-full bg-primary-container rounded-t-sm transition-all"
                      style={{ height: `${h}%`, opacity: `${40 + h * 0.6}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-primary-container text-on-primary-container rounded-xl p-lg airy-shadow flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-4xl mb-md">payments</span>
                <h3 className="font-headline-md text-headline-md mb-xs">Pay-as-you-go</h3>
                <p className="font-body-md text-body-md opacity-90">
                  Only pay for the exact compute time your models consume. No upfront commitment required.
                </p>
              </div>
              <div className="mt-xl">
                <p className="font-label-md text-label-md opacity-70 uppercase mb-xs">Starting from</p>
                <p className="font-display text-display">
                  $0.004 <span className="text-body-lg opacity-80">/1k tokens</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-container-max mx-auto px-gutter mb-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg items-stretch">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`bg-surface-container-lowest border rounded-xl p-lg airy-shadow flex flex-col relative ${
                  tier.featured
                    ? "border-2 border-primary active-glow"
                    : "border-outline-variant/30"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-label-md text-label-md px-md py-1 rounded-full uppercase tracking-widest">
                    Recommended
                  </div>
                )}
                <div className="mb-lg">
                  <h4 className="font-headline-md text-headline-md text-on-surface">{tier.name}</h4>
                  <p className="font-body-sm text-body-sm text-secondary">{tier.description}</p>
                </div>
                <div className="mb-lg">
                  <span className="font-display text-display text-on-surface">{tier.price}</span>
                  {tier.period && <span className="font-body-md text-body-md text-secondary">{tier.period}</span>}
                </div>
                <ul className="flex-grow space-y-md mb-xl">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-sm">
                      <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                      <span className="font-body-md text-body-md text-on-surface-variant">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-md px-lg rounded-lg font-body-md font-bold transition-all ${
                    tier.featured
                      ? "bg-primary text-on-primary hover:opacity-90"
                      : tier.name === "Enterprise"
                        ? "bg-on-surface text-background hover:opacity-90"
                        : "bg-surface border border-outline-variant text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-gutter mb-xl">
          <h2 className="font-headline-md text-headline-md text-center mb-xl">Frequently Asked Questions</h2>
          <div className="space-y-md">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="bg-surface-container-low p-md rounded-xl border border-outline-variant/20 group open:bg-surface-container"
              >
                <summary className="flex justify-between items-center text-left cursor-pointer list-none">
                  <span className="font-body-lg text-body-lg text-on-surface font-bold">{faq.q}</span>
                  <span className="material-symbols-outlined text-secondary transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="mt-sm">
                  <p className="font-body-md text-body-md text-on-surface-variant">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="max-w-container-max mx-auto px-gutter mb-xl">
          <div className="bg-primary text-on-primary p-xl rounded-3xl airy-shadow relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container opacity-20 blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-container opacity-20 blur-3xl -ml-32 -mb-32" />
            <h2 className="font-display text-display mb-md relative z-10">Ready to accelerate your AI builds?</h2>
            <p className="font-body-lg text-body-lg opacity-90 mb-lg max-w-xl mx-auto relative z-10">
              Join over 10,000 developers building on the most performant decentralized AI marketplace.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-md relative z-10">
              <button className="bg-on-primary text-primary px-xl py-md rounded-full font-body-md font-bold hover:bg-primary-container hover:text-on-primary-container transition-all shadow-lg">
                Create Developer Account
              </button>
              <button className="bg-transparent border-2 border-on-primary text-on-primary px-xl py-md rounded-full font-body-md font-bold hover:bg-on-primary/10 transition-all">
                View API Documentation
              </button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
