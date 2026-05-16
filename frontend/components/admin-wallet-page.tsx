import { BadgeDollarSign, CircleDollarSign, Copy, Crown, Gift, WalletCards } from "lucide-react";

import { AdminWalletCatalogPanel } from "@/components/admin-wallet-catalog-panel";
import { AdminWalletHistoryCard } from "@/components/admin-wallet-history-card";
import { AdminWalletOrderForm } from "@/components/admin-wallet-order-form";
import { AdminWalletOrderRow } from "@/components/admin-wallet-order-row";
import { AdminWalletPlanPurchase } from "@/components/admin-wallet-plan-purchase";
import type { WalletOverviewData } from "@/lib/admin-console-api";
import type { WalletPageCopy } from "@/lib/wallet-page-copy-types";

function StatPanel({
  title,
  values,
  actions,
}: {
  title: string;
  values: Array<{ label: string; value: string; icon: string }>;
  actions?: string[];
}) {
  return (
    <div className="rounded-[20px] bg-[linear-gradient(135deg,#55d9b4_0%,#73c7c0_100%)] p-5 text-white shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-[1.1rem] font-semibold">{title}</h3>
        {actions ? (
          <div className="flex items-center gap-2">
            {actions.map((action) => (
              <button
                key={action}
                className="rounded-full bg-white/14 px-3 py-1.5 text-[0.74rem] font-medium transition-colors hover:bg-white/20"
              >
                {action}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {values.map((item) => (
          <div key={item.label}>
            <p className="text-[0.76rem] opacity-90">{item.value}</p>
            <p className="mt-2 flex items-center gap-1.5 text-[0.8rem] opacity-95">
              <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminWalletPage({
  wallet,
  locale,
  copy,
}: {
  wallet: WalletOverviewData | null;
  locale: string;
  copy: WalletPageCopy;
}) {
  const amountOptions = ["68 ￥", "136 ￥", "340 ￥", "680 ￥", "1360 ￥", "3400 ￥"];
  const balance = wallet ? formatMoney(wallet.balance) : "¥0.00";
  const spent = wallet ? formatMoney(wallet.total_spent) : "¥0.00";
  const requestCount = wallet ? String(wallet.total_requests) : "0";
  const rechargeTotal = wallet ? formatMoney(wallet.total_recharged) : "¥0.00";
  const successCount = wallet ? String(wallet.successful_requests) : "0";
  const failedCount = wallet ? String(wallet.failed_requests) : "0";

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-surface-container-low p-3 text-primary">
            <WalletCards className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[1.55rem] font-semibold text-on-surface">{copy.header.title}</h2>
            <p className="mt-1 text-[0.9rem] text-on-surface-variant">{copy.header.subtitle}</p>
          </div>
        </div>
        <button className="rounded-full bg-primary-container px-4 py-2 text-[0.84rem] font-medium text-on-primary">{copy.header.billing}</button>
      </div>

      {/* Stats panel */}
      <StatPanel
        title={copy.stats.accountStats}
        values={[
          { label: copy.stats.currentBalance, value: balance, icon: "account_balance_wallet" },
          { label: copy.stats.historicalSpend, value: spent, icon: "monitoring" },
          { label: copy.stats.requestCount, value: requestCount, icon: "bar_chart" },
        ]}
      />

      {/* Two-column layout: recharge form | payment + affiliate */}
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left column: recharge */}
        <div className="space-y-6">
          {wallet ? (
            <AdminWalletPlanPurchase
              tenantId={wallet.tenant_id}
              plans={wallet.payment_plans}
              channels={wallet.payment_channels}
              copy={copy.purchase}
            />
          ) : null}

          <div>
            <p className="text-[0.95rem] font-semibold text-on-surface">
              {copy.recharge.quickHint} <span className="text-[0.82rem] text-on-surface-variant">{copy.recharge.exchangeRate}</span>
            </p>
            <div className="mt-3 rounded-[16px] border border-[#f2cb6b] bg-[#fff8e7] px-4 py-3 text-[0.9rem] text-[#8a4f11]">
              {copy.recharge.vipHint}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {amountOptions.map((item) => (
                <div
                  key={item}
                  className="rounded-[18px] border border-outline-variant/20 bg-surface px-4 py-4 dark:bg-surface-container-low"
                  >
                  <p className="flex items-center gap-2 text-[1.05rem] font-semibold text-on-surface">
                    <CircleDollarSign className="h-5 w-5" />
                    {item}
                  </p>
                  <p className="mt-3 text-[0.84rem] leading-6 text-on-surface-variant">
                    {copy.recharge.paidAmount(item.replace(" ￥", ".00"))}，{copy.recharge.savedAmount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Redeem code */}
          <div className="rounded-[20px] border border-outline-variant/20 bg-surface dark:bg-surface-container-low">
            <div className="border-b border-outline-variant/10 px-5 py-4 text-[1rem] font-semibold text-on-surface">
              {copy.recharge.redeemTitle}
            </div>
            <div className="px-5 py-5">
              <div className="flex overflow-hidden rounded-[16px] border border-outline-variant/20">
                <div className="flex flex-1 items-center gap-3 bg-surface px-4 py-3 text-on-surface-variant dark:bg-surface-container-low">
                  <Gift className="h-4 w-4" />
                  {copy.recharge.redeemPlaceholder}
                </div>
                <button className="bg-primary-container px-5 text-[0.88rem] font-medium text-on-primary">
                  {copy.recharge.redeemAction}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: payment methods + affiliate */}
        <div className="space-y-6">
          <AdminWalletCatalogPanel wallet={wallet} copy={copy.catalog} formsCopy={copy.forms} />

          <div className="rounded-[20px] border border-outline-variant/20 bg-surface dark:bg-surface-container-low">
            <div className="border-b border-outline-variant/10 px-5 py-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-surface-container-low p-3 text-primary">
                  <BadgeDollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-[1.55rem] font-semibold text-on-surface">{copy.affiliate.title}</h2>
                  <p className="mt-1 text-[0.9rem] text-on-surface-variant">{copy.affiliate.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="p-5">
              <StatPanel
                title={copy.affiliate.commissionStats}
                actions={[copy.affiliate.withdraw, copy.affiliate.transferToBalance]}
                values={[
                  { label: copy.affiliate.totalRecharged, value: rechargeTotal, icon: "monitoring" },
                  { label: copy.affiliate.successfulRequests, value: successCount, icon: "bar_chart" },
                  { label: copy.affiliate.failedRequests, value: failedCount, icon: "group" },
                ]}
              />
              <div className="mt-5 overflow-hidden rounded-[16px] border border-outline-variant/20">
                <div className="grid grid-cols-[140px_1fr_96px]">
                  <div className="bg-surface-container-low px-4 py-3 text-[0.9rem] font-medium text-on-surface-variant">{copy.affiliate.inviteLink}</div>
                  <div className="truncate bg-surface px-4 py-3 text-[0.9rem] text-on-surface">https://subrouter.ai/register?aff=40Eq</div>
                  <button className="bg-primary-container px-4 text-[0.9rem] font-medium text-on-primary">
                    <span className="inline-flex items-center gap-2"><Copy className="h-4 w-4" />{copy.affiliate.copy}</span>
                  </button>
                </div>
              </div>
              <div className="mt-5 rounded-[16px] border border-outline-variant/20">
                <div className="border-b border-outline-variant/10 px-4 py-3 text-[0.95rem] font-medium text-on-surface-variant">{copy.affiliate.commissionNotes}</div>
                <div className="space-y-4 px-4 py-4 text-[0.9rem] text-on-surface">
                  {copy.affiliate.notes.map((item) => (
                    <p key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-3 w-3 rounded-full bg-primary-container" />
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </div>
              <div className="mt-5 rounded-[16px] border border-outline-variant/20">
                <div className="border-b border-outline-variant/10 px-4 py-3 text-[0.95rem] font-medium text-on-surface-variant">{copy.affiliate.kolTitle}</div>
                <div className="flex items-center justify-between gap-4 px-4 py-4">
                  <p className="text-[0.9rem] text-on-surface">{copy.affiliate.kolDescription}</p>
                  <button className="rounded-full bg-primary-container px-4 py-2 text-[0.84rem] font-medium text-on-primary">
                    <span className="inline-flex items-center gap-2"><Crown className="h-4 w-4" />{copy.affiliate.applyKol}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          {wallet ? <AdminWalletOrderForm tenantId={wallet.tenant_id} copy={copy.orders} /> : null}
          <div className="rounded-[20px] border border-outline-variant/20 bg-surface dark:bg-surface-container-low">
            <div className="border-b border-outline-variant/10 px-5 py-4 text-[1rem] font-semibold text-on-surface">
              {copy.orders.recentOrders}
            </div>
            <div className="space-y-3 px-5 py-5">
              {wallet && wallet.recent_orders.length > 0 ? (
                wallet.recent_orders.map((order) => <AdminWalletOrderRow key={order.id} order={order} copy={copy.orders} />)
              ) : (
                <div className="py-8 text-center text-[0.92rem] text-on-surface-variant">{copy.orders.emptyOrders}</div>
              )}
            </div>
          </div>
        </div>
        <AdminWalletHistoryCard
          title={copy.history.title}
          empty={copy.history.empty}
          items={(wallet?.recent_entries ?? []).map((item) => ({
            title: item.description,
            meta: copy.history.balanceMeta(item.direction, formatMoney(item.balance_after)),
            value: formatMoney(item.amount),
          }))}
        />
      </div>
    </div>
  );
}

function formatMoney(value: string) {
  return `¥${Number(value || 0).toFixed(2)}`;
}
