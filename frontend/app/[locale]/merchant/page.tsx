import { PublicNav } from "@/components/public-nav";
import { MerchantSubNav, MerchantHero, MerchantKeysCard, MerchantBookmarks, MerchantModelsTable } from "@/components/merchant-dashboard";

export default function MerchantPage() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      <PublicNav activeId="console" />

      <main className="mt-[72px] max-w-max-width mx-auto px-margin py-xl space-y-lg">
        <MerchantSubNav />
        <MerchantHero />
        <MerchantKeysCard />
        <MerchantBookmarks />
        <MerchantModelsTable />
      </main>

      <footer className="w-full py-xl bg-surface-container-lowest border-t border-outline-variant/20 mt-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter px-margin max-w-max-width mx-auto">
          <div className="col-span-2">
            <span className="font-headline-md text-on-background block mb-md">OpenTruck</span>
            <p className="font-body-sm text-body-sm text-secondary opacity-80">&copy; 2024 OpenTruck. High-performance AI infrastructure.</p>
          </div>
          <div className="space-y-sm">
            <h4 className="font-bold text-body-sm text-on-surface">Resources</h4>
            <nav className="flex flex-col gap-xs">
              <a className="text-body-sm text-secondary hover:text-primary transition-all" href="#">Documentation</a>
              <a className="text-body-sm text-secondary hover:text-primary transition-all" href="#">Changelog</a>
              <a className="text-body-sm text-secondary hover:text-primary transition-all" href="#">Status</a>
            </nav>
          </div>
          <div className="space-y-sm">
            <h4 className="font-bold text-body-sm text-on-surface">Company</h4>
            <nav className="flex flex-col gap-xs">
              <a className="text-body-sm text-secondary hover:text-primary transition-all" href="#">Privacy Policy</a>
              <a className="text-body-sm text-secondary hover:text-primary transition-all" href="#">Terms of Service</a>
              <a className="text-body-sm text-secondary hover:text-primary transition-all" href="#">Community</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
