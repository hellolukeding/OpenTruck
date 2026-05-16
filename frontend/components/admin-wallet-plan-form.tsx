"use client";

import { useActionState, useEffect, useRef } from "react";

import { createPaymentPlanAction, type ConsoleActionState } from "@/lib/admin-console-actions";
import { FormStatus } from "@/components/form-status";
import type { WalletPageCopy } from "@/lib/wallet-page-copy-types";

export function AdminWalletPlanForm({ copy }: { copy: WalletPageCopy["forms"] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: ConsoleActionState = { status: "idle" };
  const [state, action, pending] = useActionState(createPaymentPlanAction, initialState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={action} className="space-y-3 rounded-[20px] border border-outline-variant/20 bg-surface p-5 dark:bg-surface-container-low">
      <h3 className="text-[1rem] font-semibold text-on-surface">{copy.newPlanTitle}</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <InputField name="name" placeholder="Growth 680" />
        <InputField name="badge_text" placeholder={copy.newPlanBadgePlaceholder} />
        <InputField name="price_amount" placeholder="680" />
        <InputField name="credit_amount" placeholder="720" />
        <InputField name="quota_units" placeholder="12000000" />
        <InputField name="sort_order" placeholder="20" />
      </div>
      <InputField name="description" placeholder={copy.newPlanDescriptionPlaceholder} />
      <label className="flex items-center gap-2 text-[0.88rem] text-on-surface">
        <input type="checkbox" name="is_featured" />
        {copy.newPlanFeatured}
      </label>
      <FormStatus status={state.status} message={state.message} />
      <button type="submit" disabled={pending} className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.9rem] font-medium text-on-primary disabled:opacity-50">
        {pending ? copy.newPlanSubmitting : copy.newPlanSubmit}
      </button>
    </form>
  );
}

function InputField({ name, placeholder }: { name: string; placeholder: string }) {
  return <input name={name} placeholder={placeholder} className="h-11 rounded-[12px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.88rem] text-on-surface dark:bg-surface" />;
}
