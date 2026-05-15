import type { Locale, DashboardDictionary } from "@/lib/i18n";
import { AdminConsoleFooter } from "@/components/admin-console-footer";
import { AdminConsoleHeader } from "@/components/admin-console-header";
import { AdminConsoleSubnav } from "@/components/admin-console-subnav";

type AdminShellProps = {
  locale: Locale;
  currentPath: string;
  dictionary: DashboardDictionary;
  backendReachable: boolean;
  backendUrl: string;
  children: React.ReactNode;
};

export function AdminShell({
  locale,
  currentPath,
  dictionary,
  backendReachable,
  backendUrl,
  children,
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminConsoleHeader
        locale={locale}
        currentPath={currentPath}
        dictionary={dictionary}
      />
      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-3.5 px-4 pb-12 pt-[4.5rem]">
        <AdminConsoleSubnav
          locale={locale}
          currentPath={currentPath}
          dictionary={dictionary}
        />
        <div className="rounded-[24px] border border-outline-variant/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0))] p-0 dark:bg-[linear-gradient(180deg,rgba(58,59,68,0.28),rgba(18,19,24,0))]">
          {children}
        </div>
        <section className="rounded-[20px] border border-outline-variant/30 bg-surface-container-lowest/90 px-4 py-3 text-[0.78rem] text-on-surface-variant shadow-sm dark:bg-surface-container-low/70">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <span>{backendLabel(backendReachable, dictionary)}</span>
            <span className="font-code-sm text-primary">{backendUrl}</span>
          </div>
        </section>
      </main>
      <AdminConsoleFooter />
    </div>
  );
}

function backendLabel(reachable: boolean, dictionary: DashboardDictionary) {
  return reachable ? dictionary.backendOnline : dictionary.backendOffline;
}
