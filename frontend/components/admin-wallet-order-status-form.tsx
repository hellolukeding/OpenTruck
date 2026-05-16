"use client";

import { useActionState } from "react";

import { FormStatus } from "@/components/form-status";
import type { PaymentOrder } from "@/lib/admin-console-api";
import { type ConsoleActionState } from "@/lib/admin-console-actions";
import { updatePaymentOrderStatusAction } from "@/lib/admin-console-wallet-actions";
import type { WalletPageCopy } from "@/lib/wallet-page-copy-types";

const idleState: ConsoleActionState = { status: "idle" };

export function AdminWalletOrderStatusForm({ order, copy }: { order: PaymentOrder; copy: WalletPageCopy["orders"] }) {
  const [state, action, pending] = useActionState(updatePaymentOrderStatusAction, idleState);

  return (
    <form action={action} className="mt-4 grid gap-3">
      <input type="hidden" name="order_id" value={order.id} />
      <div className="grid gap-3 md:grid-cols-[0.8fr_1.2fr_auto]">
        <select
          name="status"
          defaultValue={order.status}
          className="h-10 rounded-[12px] border border-outline-variant/20 bg-surface px-3 text-[0.84rem] text-on-surface dark:bg-surface-container-low"
        >
          <option value="pending">pending</option>
          <option value="processing">processing</option>
          <option value="cancelled">cancelled</option>
        </select>
        <input
          name="note"
          defaultValue={order.note ?? ""}
          placeholder={copy.updateNotePlaceholder}
          className="h-10 rounded-[12px] border border-outline-variant/20 bg-surface px-3 text-[0.84rem] text-on-surface dark:bg-surface-container-low"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-[12px] border border-outline-variant/20 px-3 py-2 text-[0.82rem] font-medium text-on-surface disabled:opacity-50"
        >
          {pending ? copy.updating : copy.update}
        </button>
      </div>
      <FormStatus status={state.status} message={state.message} />
    </form>
  );
}
