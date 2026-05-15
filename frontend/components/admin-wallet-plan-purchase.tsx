"use client";

import { useActionState, useState } from "react";

import { FormStatus } from "@/components/form-status";
import type { PaymentChannel, PaymentPlan } from "@/lib/admin-console-api";
import { type ConsoleActionState } from "@/lib/admin-console-actions";
import { createPaymentOrderFromPlanAction } from "@/lib/admin-console-wallet-actions";

const idleState: ConsoleActionState = { status: "idle" };

export function AdminWalletPlanPurchase({
  tenantId,
  plans,
  channels,
}: {
  tenantId: string;
  plans: PaymentPlan[];
  channels: PaymentChannel[];
}) {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id ?? "");
  const [selectedChannelId, setSelectedChannelId] = useState(channels[0]?.id ?? "");
  const [state, action, pending] = useActionState(createPaymentOrderFromPlanAction, idleState);

  return (
    <form action={action} className="space-y-4 rounded-[20px] border border-outline-variant/20 bg-surface p-5 dark:bg-surface-container-low">
      <input type="hidden" name="tenant_id" value={tenantId} />
      <input type="hidden" name="plan_id" value={selectedPlanId} />
      <input type="hidden" name="channel_id" value={selectedChannelId} />
      <h3 className="text-[1rem] font-semibold text-on-surface">按套餐下单</h3>
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
              入账 ¥{Number(plan.credit_amount).toFixed(0)} / 额度 {plan.quota_units.toLocaleString()}
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
        placeholder="备注，例如自动购买 Growth 680"
        className="h-12 w-full rounded-[14px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.9rem] text-on-surface dark:bg-surface"
      />
      <FormStatus status={state.status} message={state.message} />
      <button
        type="submit"
        disabled={pending || !selectedPlanId}
        className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.9rem] font-medium text-on-primary disabled:opacity-50"
      >
        {pending ? "创建中..." : "创建套餐订单"}
      </button>
    </form>
  );
}
