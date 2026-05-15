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

export function ApiDocsSidebar() {
  return (
    <aside className="fixed left-0 h-[calc(100vh-header)] w-64 bg-surface-container-low border-r border-outline-variant/20 overflow-y-auto scrollbar-hide py-lg hidden md:block">
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
