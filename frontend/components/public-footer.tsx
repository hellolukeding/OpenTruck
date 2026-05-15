import Link from "next/link";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Models", href: "/models" },
      { label: "Marketplace", href: "/merchant" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/api-docs" },
      { label: "API Keys", href: "/en" },
      { label: "Status", href: "#" },
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

export function PublicFooter() {
  return (
    <footer className="bg-secondary-container border-t border-outline-variant">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-md px-gutter py-xl max-w-container-max mx-auto">
        <div className="col-span-2">
          <span className="font-display text-body-lg font-bold text-on-surface block mb-4">OpenTruck</span>
          <p className="font-body-sm text-body-sm text-on-secondary-container/80 max-w-xs leading-relaxed mb-lg">
            Building the infrastructure for the decentralized AI future. High-performance models, distributed worldwide.
          </p>
        </div>
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h5 className="font-label-md text-label-md font-bold uppercase text-on-surface mb-4">{col.title}</h5>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body-sm text-body-sm text-on-secondary-container hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-container-max mx-auto px-gutter py-md border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body-sm text-body-sm text-on-secondary-container/60">
          &copy; 2024 OpenTruck. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="font-body-sm text-body-sm text-on-secondary-container/60">
            All Systems Operational
          </span>
        </div>
      </div>
    </footer>
  );
}
