"use client";

import { useActionState, useEffect, useRef } from "react";

import { createPaymentChannelAction, type ConsoleActionState } from "@/lib/admin-console-actions";
import { FormStatus } from "@/components/form-status";
import type { WalletPageCopy } from "@/lib/wallet-page-copy-types";

export function AdminWalletChannelForm({ copy }: { copy: WalletPageCopy["forms"] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: ConsoleActionState = { status: "idle" };
  const [state, action, pending] = useActionState(createPaymentChannelAction, initialState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={action} className="space-y-3 rounded-[20px] border border-outline-variant/20 bg-surface p-5 dark:bg-surface-container-low">
      <h3 className="text-[1rem] font-semibold text-on-surface">{copy.newChannelTitle}</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <InputField name="name" placeholder={copy.newChannelNamePlaceholder} />
        <InputField name="provider" placeholder="alipay" />
        <InputField name="channel_code" placeholder="alipay_qr" />
        <InputField name="sort_order" placeholder="10" />
      </div>
      <InputField name="description" placeholder={copy.newChannelDescriptionPlaceholder} />
      <label className="flex items-center gap-2 text-[0.88rem] text-on-surface">
        <input type="checkbox" name="is_recommended" />
        {copy.newChannelRecommended}
      </label>
      <FormStatus status={state.status} message={state.message} />
      <button type="submit" disabled={pending} className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.9rem] font-medium text-on-primary disabled:opacity-50">
        {pending ? copy.newChannelSubmitting : copy.newChannelSubmit}
      </button>
    </form>
  );
}

function InputField({ name, placeholder }: { name: string; placeholder: string }) {
  return <input name={name} placeholder={placeholder} className="h-11 rounded-[12px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.88rem] text-on-surface dark:bg-surface" />;
}
