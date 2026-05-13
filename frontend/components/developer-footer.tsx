const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Status", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: "#" },
      { label: "Discord", href: "#" },
    ],
  },
];

export function DeveloperFooter() {
  return (
    <footer className="pt-xl pb-lg border-t border-outline-variant/30 mt-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-md">
        <div className="col-span-2">
          <h4 className="font-display text-body-lg font-bold text-on-surface mb-sm">OpenTruck</h4>
          <p className="font-body-sm text-body-sm text-secondary leading-relaxed">
            Built for the decentralized AI future. Infrastructure for high-performance model orchestration.
          </p>
        </div>
        {footerLinks.map((col) => (
          <div key={col.title} className="flex flex-col gap-xs">
            <span className="font-label-md text-label-md font-bold text-on-surface mb-xs">{col.title}</span>
            {col.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-secondary font-body-sm hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-xl flex flex-col md:flex-row justify-between items-center gap-md border-t border-outline-variant/10 pt-md">
        <span className="font-body-sm text-body-sm text-secondary">&copy; 2024 OpenTruck. All rights reserved.</span>
        <div className="flex gap-md">
          <a className="text-secondary hover:text-on-surface transition-colors" href="#">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
