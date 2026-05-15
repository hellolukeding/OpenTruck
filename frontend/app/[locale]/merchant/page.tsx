import { MerchantSubNav, MerchantHero, MerchantKeysCard, MerchantBookmarks, MerchantModelsTable } from "@/components/merchant-dashboard";

export default function MerchantPage() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      {/* Header matching opentruck_6 design */}
      <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
        <div className="flex items-center justify-between px-margin py-sm max-w-max-width mx-auto">
          <div className="flex items-center gap-xl">
            <span className="text-headline-md font-headline-md font-bold text-on-background">OpenTruck</span>
            <nav className="hidden md:flex items-center gap-lg">
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Models</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">API Docs</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Pricing</a>
              <a className="font-body-md text-body-md text-primary font-bold border-b-2 border-primary" href="#">Console</a>
            </nav>
          </div>
          <div className="flex items-center gap-md">
            <button className="p-xs text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-xs text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="flex items-center gap-sm pl-sm border-l border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary text-label-md">O</div>
              <span className="text-body-sm font-medium">oidc_5118</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </div>
          </div>
        </div>
      </header>

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
