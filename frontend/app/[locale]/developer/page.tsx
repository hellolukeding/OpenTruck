import { DeveloperSidebar } from "@/components/developer-sidebar";
import { DeveloperStats, DeveloperUsageChart } from "@/components/developer-dashboard";
import { DeveloperApiKeys, DeveloperTopModels } from "@/components/developer-analytics";
import { DeveloperFooter } from "@/components/developer-footer";

export default function DeveloperPage() {
  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      <DeveloperSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-outline-variant/30 h-16 px-gutter flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="md:hidden flex items-center gap-2">
              <span className="material-symbols-outlined text-primary font-bold">terminal</span>
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">search</span>
              <input
                className="pl-10 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-64 md:w-96 transition-all"
                placeholder="Search usage, keys, or endpoints..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-md">
            <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-all active:scale-95">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Deploy Model</span>
            </button>
          </div>
        </header>

        <div className="p-gutter md:p-margin max-w-max-width mx-auto w-full space-y-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-headline-md text-headline-md text-on-surface">Overview</h2>
                <div className="flex items-center gap-2 bg-primary-container/10 px-2 py-0.5 rounded border border-primary-container/20">
                  <div className="pulse-dot" />
                  <span className="font-label-md text-label-md text-primary">Live Systems</span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-secondary-container">Monitor your API usage and instance performance in real-time.</p>
            </div>
            <div className="flex gap-sm">
              <button className="px-4 py-2 bg-white border border-outline-variant text-on-surface rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container-high transition-all">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Last 7 Days
              </button>
              <button className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-surface-tint shadow-sm transition-all active:scale-95">
                <span className="material-symbols-outlined text-[18px]">vpn_key</span>
                Generate New Key
              </button>
            </div>
          </div>

          <DeveloperStats />
          <DeveloperUsageChart />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            <DeveloperApiKeys />
            <DeveloperTopModels />
          </div>

          <DeveloperFooter />
        </div>
      </main>
    </div>
  );
}
