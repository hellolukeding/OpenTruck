"use client";

import Link from "next/link";

const navItems = [
  { label: "Overview", href: "#", icon: "dashboard", active: true },
  { label: "API Keys", href: "#", icon: "vpn_key" },
  { label: "Usage", href: "#", icon: "bar_chart" },
  { label: "Billing", href: "#", icon: "payments" },
  { label: "Settings", href: "#", icon: "settings" },
];

const mobileNav = [
  { label: "Overview", icon: "dashboard", active: true },
  { label: "Keys", icon: "vpn_key" },
  { label: "Usage", icon: "bar_chart" },
  { label: "Settings", icon: "settings" },
];

export function DeveloperSidebar() {
  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-surface-container-low border-r border-outline-variant/20 sticky top-0 h-screen py-lg z-40">
        <div className="px-md mb-xl">
          <div className="flex items-center gap-2 mb-xs">
            <span className="material-symbols-outlined text-primary font-bold text-headline-md" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
            <h1 className="font-headline-md font-bold text-primary">OpenTruck</h1>
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-bold text-on-surface">Developer Console</span>
            <span className="font-body-sm text-body-sm text-on-secondary-container">Manage AI Models</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 transition-all ${
                item.active
                  ? "bg-primary-container/20 text-primary border-r-4 border-primary"
                  : "text-secondary hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {item.icon}
              </span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="px-md mt-auto pt-lg border-t border-outline-variant/10">
          <div className="flex items-center gap-3 px-xs">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
              <img
                alt="User Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyJYaQgZ3rwm0gzICiXRF0alg7oTuT6FaAURrs94S7V0vn3G4KSm7HLhZcnW8udGd6SZXsE4wEiR4k2nuV-ksQMgiuB7piRJGbC94C4imEq8rDeGqL5i8uhUZ3cZdFTzjqUqFL-T4J14H3vzNfuLE74krzNHtC_GdTY8WCOizRbIrd4SAo7BZVrLQD6YT7EjKdUCbxdRL9XkfXkvRfcHHgJ0E9tvJgg4TXZbMyzCm9YUXJMcVTZHymT9PqS3yKoQH982VzR7GAIYA"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface truncate w-32">dev_architect_88</span>
              <span className="font-body-sm text-body-sm text-secondary truncate">Pro Plan</span>
            </div>
          </div>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md border-t border-outline-variant/20 flex justify-around py-3 z-50">
        {mobileNav.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex flex-col items-center ${item.active ? "text-primary" : "text-secondary"}`}
          >
            <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
              {item.icon}
            </span>
            <span className="text-[10px] font-label-md mt-1">{item.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
