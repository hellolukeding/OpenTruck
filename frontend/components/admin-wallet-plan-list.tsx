import type { PaymentPlan } from "@/lib/admin-console-api";
import type { WalletPageCopy } from "@/lib/wallet-page-copy-types";
import { AdminWalletPlanActions } from "@/components/admin-wallet-plan-actions";

export function AdminWalletPlanList({
  plans,
  copy,
  formsCopy,
}: {
  plans: PaymentPlan[];
  copy: WalletPageCopy["catalog"];
  formsCopy: WalletPageCopy["forms"];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`rounded-[18px] border px-4 py-4 ${
            plan.is_featured
              ? "border-primary-container bg-[linear-gradient(180deg,rgba(83,214,180,0.10),transparent)]"
              : "border-outline-variant/20 bg-surface-container-low dark:bg-surface"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[1rem] font-semibold text-on-surface">{plan.name}</p>
            <div className="flex items-center gap-2">
              {plan.badge_text ? (
                <span className="rounded-full bg-primary-container px-3 py-1 text-[0.72rem] text-on-primary">
                  {plan.badge_text}
                </span>
              ) : null}
              <span className="rounded-full border border-outline-variant/20 px-2.5 py-1 text-[0.7rem] text-on-surface-variant">
                {plan.status}
              </span>
            </div>
          </div>
          <p className="mt-3 text-[1.4rem] font-semibold text-on-surface">¥{Number(plan.price_amount).toFixed(0)}</p>
          <p className="mt-1 text-[0.84rem] text-on-surface-variant">
            {copy.planCreditSummary(Number(plan.credit_amount).toFixed(0), plan.quota_units.toLocaleString())}
          </p>
          <p className="mt-3 text-[0.82rem] leading-6 text-on-surface-variant">
            {plan.description ?? copy.featuredPlanFallback}
          </p>
          <div className="mt-4 flex justify-end">
            <AdminWalletPlanActions plan={plan} copy={formsCopy} />
          </div>
        </div>
      ))}
    </div>
  );
}
