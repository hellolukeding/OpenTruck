import Link from "next/link";

import { MerchantMarketplaceGrid } from "@/components/merchant-marketplace-grid";
import { PublicNav } from "@/components/public-nav";

export default function MerchantMarketplacePage() {
  return (
    <div className="min-h-screen bg-[#f7f5fa] text-[#1a1b22]">
      <PublicNav activeId="merchant" ctaLabel="成为供应商" />

      <main className="grid-bg min-h-[calc(100vh-64px)] pb-16">
        <section className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-10 lg:flex-row lg:items-end lg:justify-between lg:py-12">
          <div className="max-w-[860px]">
            <h1 className="mb-4 text-[3.45rem] font-bold tracking-[-0.06em] text-[#11131a] sm:text-[4.1rem]">
              算力商家中心
            </h1>
            <p className="max-w-[760px] text-[1.04rem] leading-9 text-[#4e5753]">
              连接全球顶级模型供应商与计算节点。发现高可用、高性能的 API 资源，为您的业务提供稳定底层支撑。
            </p>
          </div>

          <Link
            href="/zh-CN/merchant"
            className="inline-flex items-center gap-3 self-start rounded-2xl bg-[#006c49] px-7 py-4 text-lg font-semibold text-white shadow-[0_18px_28px_rgba(0,108,73,0.18)] transition-transform hover:-translate-y-0.5 lg:self-auto"
          >
            <span className="material-symbols-outlined text-[28px]">storefront</span>
            成为供应商
          </Link>
        </section>

        <section className="mx-auto max-w-[1400px] px-5">
          <div className="rounded-[24px] border border-[#d7d5dd] bg-white/80 p-3.5 shadow-[0_12px_36px_rgba(28,33,42,0.06)] backdrop-blur-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="relative block flex-1">
                <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-[26px] text-[#727b76]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="搜索供应商、模型或服务关键词..."
                  className="h-14 w-full rounded-2xl border border-[#d7d5dd] bg-[#f0eef8] pl-16 pr-6 text-[1.02rem] text-[#17191f] outline-none transition-all placeholder:text-[#838b87] focus:border-[#006c49]/40 focus:bg-white focus:ring-4 focus:ring-[#006c49]/10"
                />
              </label>

              <div className="flex gap-3 lg:flex-none">
                <button
                  type="button"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-[#d7d5dd] bg-[#f0eef8] px-5 text-[1rem] text-[#17191f] transition-colors hover:border-[#006c49]/40 hover:text-[#006c49]"
                >
                  按综合性能排序
                </button>
                <button
                  type="button"
                  className="inline-flex h-14 items-center gap-2 rounded-2xl border border-[#d7d5dd] bg-[#f0eef8] px-6 text-[1rem] text-[#17191f] transition-colors hover:border-[#006c49]/40 hover:text-[#006c49]"
                >
                  <span className="material-symbols-outlined text-[22px]">filter_list</span>
                  筛选
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-5 pt-6">
          <MerchantMarketplaceGrid />
        </section>
      </main>

      <footer className="border-t border-[#d8d6de] bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-12 px-5 py-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-[2rem] font-bold tracking-[-0.04em] text-[#11131a]">OpenTruck AI</p>
            <p className="text-[1rem] leading-8 text-[#616965]">
              © 2024 OpenTruck AI Infrastructure. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-4 text-[1rem] text-[#616965]">
            {["Privacy Policy", "Terms of Service", "API Status", "GitHub"].map((item) => (
              <a key={item} href="#" className="transition-colors hover:text-[#006c49]">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
