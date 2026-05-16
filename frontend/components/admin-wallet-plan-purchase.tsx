"use client";

import { useActionState, useState } from "react";

import { FormStatus } from "@/components/form-status";
import type { PaymentChannel, PaymentPlan } from "@/lib/admin-console-api";
import { type ConsoleActionState } from "@/lib/admin-console-actions";
import { createPaymentOrderFromPlanAction } from "@/lib/admin-console-wallet-actions";
import type { WalletPageCopy } from "@/lib/wallet-page-copy-types";

const idleState: ConsoleActionState = { status: "idle" };

export function AdminWalletPlanPurchase({
  tenantId,
  plans,
  channels,
  copy,
}: {
  tenantId: string;
  plans: PaymentPlan[];
  channels: PaymentChannel[];
  copy: WalletPageCopy["purchase"];
}) {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id ?? "");
  const [selectedChannelId, setSelectedChannelId] = useState(channels[0]?.id ?? "");
  const [state, action, pending] = useActionState(createPaymentOrderFromPlanAction, idleState);

  return (
    <form action={action} className="space-y-4 rounded-[20px] border border-outline-variant/20 bg-surface p-5 dark:bg-surface-container-low">
      <input type="hidden" name="tenant_id" value={tenantId} />
      <input type="hidden" name="plan_id" value={selectedPlanId} />
      <input type="hidden" name="channel_id" value={selectedChannelId} />
      <h3 className="text-[1rem] font-semibold text-on-surface">{copy.title}</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelectedPlanId(plan.id)}
            className={`rounded-[18px] border px-4 py-4 text-left transition-colors ${
              selectedPlanId === plan.id
                ? "border-primary-container bg-[linear-gradient(180deg,rgba(83,214,180,0.10),transparent)]"
                : "border-outline-variant/20 bg-surface-container-low dark:bg-surface"
            }`}
          >
            <p className="text-[1rem] font-semibold text-on-surface">{plan.name}</p>
            <p className="mt-2 text-[1.2rem] font-semibold text-on-surface">¥{Number(plan.price_amount).toFixed(0)}</p>
            <p className="mt-1 text-[0.82rem] text-on-surface-variant">
              {copy.creditAmount(Number(plan.credit_amount).toFixed(0), plan.quota_units.toLocaleString())}
            </p>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {channels.map((channel) => (
          <button
            key={channel.id}
            type="button"
            onClick={() => setSelectedChannelId(channel.id)}
            className={`rounded-[14px] border px-4 py-3 text-[0.88rem] ${
              selectedChannelId === channel.id
                ? "border-primary-container bg-surface text-on-surface"
                : "border-outline-variant/20 bg-surface-container-low text-on-surface-variant dark:bg-surface"
            }`}
          >
            {channel.name}
          </button>
        ))}
      </div>
      <input
        name="note"
        placeholder={copy.notePlaceholder}
        className="h-12 w-full rounded-[14px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.9rem] text-on-surface dark:bg-surface"
      />
      <FormStatus status={state.status} message={state.message} />
      <button
        type="submit"
        disabled={pending || !selectedPlanId}
        className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.9rem] font-medium text-on-primary disabled:opacity-50"
      >
        {pending ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}
