import Link from "next/link";

type Props = {
  activeId?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

const navItems = [
  { label: "首页", href: "/", id: "home" },
  { label: "模型", href: "/models", id: "models" },
  { label: "商家", href: "/merchant", id: "merchant" },
  { label: "排行榜", href: "/zh-CN/leaderboard", id: "leaderboard" },
  { label: "文档", href: "/api-docs", id: "api-docs" },
  { label: "控制台", href: "/zh-CN", id: "console" },
];

export function PublicNav({
  activeId,
  ctaLabel = "开通经营站",
  ctaHref = "/zh-CN/merchant",
}: Props) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#d8d6de] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-container-max items-center justify-between px-5">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-[2.1rem] font-bold tracking-[-0.04em] text-[#12141a]">
            OpenTruck
          </Link>
          <nav className="hidden items-center gap-8 text-[15px] text-[#545d59] md:flex">
            {navItems.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`border-b-2 py-5 transition-colors ${
                  activeId === link.id
                    ? "border-[#006c49] text-[#006c49]"
                    : "border-transparent hover:text-[#006c49]"
                }`}
              >
                {link.label}
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
            href={ctaHref}
            className="hidden rounded-full bg-[#006c49] px-5 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            {ctaLabel}
          </Link>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8d6de] bg-[radial-gradient(circle_at_30%_30%,#6ffbbe_0%,#006c49_68%,#003221_100%)] text-sm font-semibold text-white shadow-[0_12px_20px_rgba(0,108,73,0.18)]">
            OT
          </div>
        </div>
      </div>
    </header>
  );
}
