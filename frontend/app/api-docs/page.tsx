import { PublicNav } from "@/components/public-nav";
import { TerminalBlock } from "@/components/terminal-block";

const sidebarLinks = [
  { section: "Getting Started", items: [
    { label: "Introduction", href: "#", icon: "rocket_launch" },
    { label: "Authentication", href: "#", icon: "vpn_key" },
    { label: "Errors", href: "#", icon: "terminal" },
  ]},
  { section: "Endpoints", items: [
    { label: "Chat Completions", href: "#", icon: "forum", active: true },
    { label: "Images", href: "#", icon: "image" },
    { label: "Audio", href: "#", icon: "audio_file" },
    { label: "Fine-tuning", href: "#", icon: "layers" },
    { label: "Embeddings", href: "#", icon: "database" },
  ]},
];

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

function Sidebar() {
  return (
    <aside className="fixed left-0 h-[calc(100vh-64px)] w-64 bg-surface-container-low border-r border-outline-variant/20 overflow-y-auto scrollbar-hide py-lg hidden md:block">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="material-symbols-outlined text-primary">developer_board</span>
          <h3 className="font-headline-md font-bold text-on-surface text-[18px]">API Documentation</h3>
        </div>
        <p className="font-label-md text-label-md text-secondary">v2.4.0 &bull; Stable</p>
      </div>
      <nav className="space-y-1">
        {sidebarLinks.map((group) => (
          <div key={group.section}>
            <div className="px-6 py-2">
              <p className="text-[11px] font-bold tracking-widest text-on-surface-variant/60 uppercase">
                {group.section}
              </p>
            </div>
            {group.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-2 transition-all ${
                  item.active
                    ? "bg-primary-container/20 text-primary border-r-4 border-primary"
                    : "text-secondary hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-label-md text-label-md">{item.label}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function CodePanel() {
  return (
    <div className="w-full lg:w-[500px] xl:w-[600px] bg-[#0E0E0E] lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] overflow-y-auto border-l border-white/5">
      <div className="p-8">
        <div className="flex items-center gap-1 mb-6 border-b border-white/10">
          {["curl", "Python", "Node.js"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-code-md text-[13px] ${
                tab === "curl" ? "text-white border-b-2 border-primary-container" : "text-white/50 hover:text-white"
              } transition-colors`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="group relative rounded-lg overflow-hidden border border-white/10 mb-8 shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
            <span className="text-[11px] text-white/40 font-code-md tracking-wider uppercase">Example Request</span>
            <button className="p-1 hover:bg-white/10 rounded transition-colors">
              <span className="material-symbols-outlined text-[18px] text-white/60">content_copy</span>
            </button>
          </div>
          <pre className="p-6 overflow-x-auto font-code-md text-[13px] leading-relaxed text-[#D4D4D4]">
{`curl https://api.opentruck.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENTRUCK_API_KEY" \\
  -d {
    "model": "gpt-4o",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ]
  }`}
          </pre>
        </div>

        <div className="group relative rounded-lg overflow-hidden border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/40 font-code-md tracking-wider uppercase">Example Response</span>
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
            <span className="text-[11px] text-white/40 font-code-md">200 OK</span>
          </div>
          <pre className="p-6 overflow-x-auto font-code-md text-[13px] leading-relaxed text-[#D4D4D4]">
{`{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4o",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Hello there, how may I help you today?"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}`}
          </pre>
        </div>

        <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary-container">lightbulb</span>
            <h4 className="text-white font-bold text-body-md">Developer Insight</h4>
          </div>
          <p className="text-white/60 text-body-sm leading-relaxed">
            Use streaming to improve perceived performance. Our global infrastructure provides
            sub-100ms first-token latency on most standard models.
          </p>
        </div>
      </div>
    </div>
  );
}

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
        <Sidebar />

        <main className="flex-1 ml-0 md:ml-64">
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

            <CodePanel />
          </div>
        </main>
      </div>

      <footer className="w-full bg-secondary-container border-t border-outline-variant mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-md px-gutter py-xl max-w-container-max mx-auto">
          <div className="col-span-2">
            <p className="font-display text-body-lg font-bold text-on-surface mb-4">OpenTruck</p>
            <p className="font-body-sm text-body-sm text-on-secondary-container max-w-xs leading-relaxed opacity-80">
              Built for the decentralized AI future. Connecting top-tier compute with the most ambitious developers.
            </p>
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
            <span className="w-2 h-2 rounded-full bg-primary" /> All Systems Operational
          </span>
        </div>
      </footer>
    </div>
  );
}
