"use client";

import { useActionState, useEffect, useRef } from "react";

import { FormStatus } from "@/components/form-status";
import { type ConsoleActionState } from "@/lib/admin-console-actions";
import { createPaymentOrderAction } from "@/lib/admin-console-wallet-actions";
import type { WalletPageCopy } from "@/lib/wallet-page-copy-types";

export function AdminWalletOrderForm({ tenantId, copy }: { tenantId: string; copy: WalletPageCopy["orders"] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: ConsoleActionState = { status: "idle" };
  const [state, action, pending] = useActionState(createPaymentOrderAction, initialState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={action} className="space-y-4 rounded-[20px] border border-outline-variant/20 bg-surface p-5 dark:bg-surface-container-low">
      <input type="hidden" name="tenant_id" value={tenantId} />
      <h3 className="text-[1rem] font-semibold text-on-surface">{copy.createOrder}</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <InputField name="amount" placeholder={copy.amountPlaceholder} />
        <InputField name="credited_amount" placeholder={copy.creditedAmountPlaceholder} />
        <InputField name="payment_provider" placeholder={copy.providerPlaceholder} />
        <InputField name="payment_channel" placeholder={copy.channelPlaceholder} />
      </div>
      <InputField name="note" placeholder={copy.notePlaceholder} />
      <FormStatus status={state.status} message={state.message} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.9rem] font-medium text-on-primary disabled:opacity-50"
      >
        {pending ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}

function InputField({ name, placeholder }: { name: string; placeholder: string }) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      className="h-12 rounded-[14px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.9rem] text-on-surface dark:bg-surface"
    />
  );
}
