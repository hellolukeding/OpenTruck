import { ApiCodePanel } from "@/components/api-code-panel";
import { ApiDocsSidebar } from "@/components/api-docs-sidebar";
import { PublicNav } from "@/components/public-nav";

const params = [
  {
    name: "model",
    type: "string",
    required: true,
    desc: "ID of the model to use. You can use gpt-4o, claude-3-5-sonnet, or our optimized opentruck-v2.",
  },
  {
    name: "messages",
    type: "array",
    required: true,
    desc: "A list of messages comprising the conversation so far.",
    children: [
      { name: "role", type: "string", desc: "One of system, user, assistant, or tool." },
      { name: "content", type: "string", desc: "The contents of the message." },
    ],
  },
  {
    name: "temperature",
    type: "number",
    required: false,
    default: "1",
    desc: "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random.",
  },
  {
    name: "stream",
    type: "boolean",
    required: false,
    default: "false",
    desc: "If set, partial message deltas will be sent as SSE tokens.",
  },
];

function ParamRow({ name, type, required, desc, children, default: def }: typeof params[0]) {
  return (
    <div className="flex flex-col gap-4 py-6 border-b border-outline-variant/30 last:border-b-0">
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="font-code-md font-bold text-primary">{name}</span>
        <span className="text-secondary text-[12px] font-medium uppercase tracking-wider">{type}</span>
        {required && (
          <span className="px-1.5 py-0.5 bg-tertiary-container/10 text-tertiary rounded text-[10px] font-bold">
            REQUIRED
          </span>
        )}
        {def !== undefined && <span className="text-secondary/50 text-[11px]">Defaults to {def}</span>}
      </div>
      <p className="text-on-surface-variant font-body-md">{desc}</p>
      {children && (
        <div className="ml-6 pl-6 border-l-2 border-outline-variant/30 space-y-4">
          {children.map((child) => (
            <div key={child.name} className="flex flex-col gap-1">
              <div className="flex items-baseline gap-3">
                <span className="font-code-md font-bold text-on-surface">{child.name}</span>
                <span className="text-secondary text-[11px] uppercase">{child.type}</span>
              </div>
              <p className="text-on-surface-variant text-body-sm">{child.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary-container/30">
      <PublicNav activeId="api-docs" />

      <div className="flex min-h-screen pt-16">
        <ApiDocsSidebar />

        <main className="flex-1 ml-0 md:ml-64 grid-bg">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row">
            <div className="flex-1 px-8 py-12 lg:px-12 border-r border-outline-variant/10 bg-white/50 backdrop-blur-sm">
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 bg-primary-container/10 text-primary border border-primary/20 rounded font-code-md text-[11px] font-bold">
                    POST
                  </span>
                  <span className="font-code-md text-body-sm text-on-surface-variant">/v1/chat/completions</span>
                </div>
                <h1 className="font-display text-display text-[40px] mb-4 text-on-surface">Chat Completions</h1>
                <p className="font-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                  Creates a model response for the given chat conversation. Use this endpoint
                  to generate natural language text based on a sequence of messages.
                </p>
              </div>

              <section>
                <h2 className="font-headline-md text-headline-md mb-6 border-b border-outline-variant pb-3">
                  Request Body
                </h2>
                <div className="space-y-0">
                  {params.map((p) => (
                    <ParamRow key={p.name} {...p} />
                  ))}
                </div>
              </section>
            </div>

            <ApiCodePanel />
          </div>
        </main>
      </div>

      <footer className="w-full bg-secondary-container border-t border-outline-variant mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-md px-gutter py-xl max-w-container-max mx-auto">
          <div className="col-span-2">
            <p className="font-display text-body-lg font-bold text-on-surface mb-4">OpenTruck</p>

            <div className="flex gap-4">
              <span className="material-symbols-outlined text-on-secondary-container/60 hover:text-primary cursor-pointer transition-colors">public</span>
              <span className="material-symbols-outlined text-on-secondary-container/60 hover:text-primary cursor-pointer transition-colors">hub</span>
              <span className="material-symbols-outlined text-on-secondary-container/60 hover:text-primary cursor-pointer transition-colors">terminal</span>
            </div>
          </div>
          {[
            { title: "Resources", links: ["Documentation", "Status", "API Docs"] },
            { title: "Community", links: ["GitHub", "Discord", "Twitter"] },
            { title: "Legal", links: ["Privacy", "Terms"] },
          ].map((col) => (
            <div key={col.title}>
              <p className="font-bold text-[11px] uppercase tracking-widest text-on-secondary-container/60 mb-6">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a className="font-body-sm text-body-sm text-on-secondary-container hover:text-primary transition-colors" href="#">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-container-max mx-auto px-gutter py-6 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body-sm text-body-sm text-on-secondary-container/60">&copy; 2024 OpenTruck. All rights reserved.</p>
          <span className="flex items-center gap-2 text-on-secondary-container/60 text-[12px]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" /> All Systems Operational
          </span>
        </div>
      </footer>
    </div>
  );
}
