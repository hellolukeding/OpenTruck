import { AdminWalletChannelForm } from "@/components/admin-wallet-channel-form";
import { AdminWalletChannelList } from "@/components/admin-wallet-channel-list";
import { AdminWalletPlanForm } from "@/components/admin-wallet-plan-form";
import { AdminWalletPlanList } from "@/components/admin-wallet-plan-list";
import type { WalletOverviewData } from "@/lib/admin-console-api";

export function AdminWalletCatalogPanel({ wallet }: { wallet: WalletOverviewData | null }) {
  return (
    <>
      <AdminWalletChannelList channels={wallet?.payment_channels ?? []} />
      <div className="rounded-[20px] border border-outline-variant/20 bg-surface dark:bg-surface-container-low">
        <div className="flex items-center justify-between border-b border-outline-variant/10 px-5 py-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-[1.2rem] font-semibold text-on-surface">订阅套餐</h3>
            </div>
            <p className="mt-1 text-[0.88rem] text-on-surface-variant">购买订阅获得模型额度/次数</p>
          </div>
          <button className="rounded-full border border-outline-variant/20 px-4 py-2 text-[0.82rem] text-on-surface">优先订阅</button>
        </div>
        <div className="space-y-5 px-5 py-5">
          {wallet && wallet.payment_plans.length > 0 ? (
            <AdminWalletPlanList plans={wallet.payment_plans} />
          ) : (
            <div className="py-12 text-center text-[1rem] text-on-surface-variant">暂无可购买套餐</div>
          )}
          <div className="grid gap-5 xl:grid-cols-2">
            <AdminWalletPlanForm />
            <AdminWalletChannelForm />
          </div>
        </div>
      </div>
    </>
  );
}
