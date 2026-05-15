import Link from "next/link";

const navItems = [
  { label: "首页", href: "/" },
  { label: "模型", href: "/models" },
  { label: "商家", href: "/merchant", active: true },
  { label: "排行榜", href: "/zh-CN/leaderboard" },
  { label: "文档", href: "/api-docs" },
  { label: "控制台", href: "/zh-CN" },
];

export function MerchantMarketplaceHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d8d6de] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-[2.1rem] font-bold tracking-[-0.04em] text-[#12141a]">
            OpenTruck
          </Link>
          <nav className="hidden items-center gap-8 text-[15px] text-[#545d59] md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`border-b-2 py-5 transition-colors ${
                  item.active
                    ? "border-[#006c49] text-[#006c49]"
                    : "border-transparent hover:text-[#006c49]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-[#616864]">
          {["notifications", "light_mode", "language"].map((icon) => (
            <button
              key={icon}
              type="button"
              className="rounded-full p-2 transition-colors hover:bg-[#f0eef8] hover:text-[#006c49]"
            >
              <span className="material-symbols-outlined text-[22px]">{icon}</span>
            </button>
          ))}
          <Link
            href="/zh-CN/merchant"
            className="hidden rounded-full bg-[#006c49] px-5 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            开通经营站
          </Link>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/40 bg-[radial-gradient(circle_at_30%_30%,#6ffbbe_0%,#006c49_68%,#003221_100%)] text-sm font-semibold text-white shadow-[0_12px_20px_rgba(0,108,73,0.18)]">
            OT
          </div>
        </div>
      </div>
    </header>
  );
}
