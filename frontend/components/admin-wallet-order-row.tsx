"use client";

import { useActionState } from "react";

import type { PaymentOrder } from "@/lib/admin-console-api";
import { settlePaymentOrderAction, type ConsoleActionState } from "@/lib/admin-console-actions";
import { FormStatus } from "@/components/form-status";

export function AdminWalletOrderRow({ order }: { order: PaymentOrder }) {
  const initialState: ConsoleActionState = { status: "idle" };
  const [state, action, pending] = useActionState(settlePaymentOrderAction, initialState);

  return (
    <div className="rounded-[16px] border border-outline-variant/20 bg-surface-container-low px-4 py-4 dark:bg-surface">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.92rem] font-medium text-on-surface">{order.order_number}</p>
          <p className="mt-1 text-[0.8rem] text-on-surface-variant">
            {order.payment_provider ?? "manual"} / {order.status}
          </p>
        </div>
        <p className="text-[0.92rem] font-semibold text-on-surface">¥{Number(order.amount).toFixed(2)}</p>
      </div>
      {order.status !== "paid" ? (
        <form action={action} className="mt-4 flex flex-wrap items-center gap-3">
          <input type="hidden" name="order_id" value={order.id} />
          <input
            name="credited_amount"
            defaultValue={order.credited_amount}
            className="h-10 rounded-[12px] border border-outline-variant/20 bg-surface px-3 text-[0.84rem] text-on-surface dark:bg-surface-container-low"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-[12px] bg-primary-container px-3 py-2 text-[0.82rem] font-medium text-on-primary disabled:opacity-50"
          >
            {pending ? "入账中..." : "手动入账"}
          </button>
          <FormStatus status={state.status} message={state.message} />
        </form>
      ) : null}
    </div>
  );
}
