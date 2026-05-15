"use client";

import { useActionState, useEffect, useRef } from "react";

import { createPaymentOrderAction, type ConsoleActionState } from "@/lib/admin-console-actions";
import { FormStatus } from "@/components/form-status";

export function AdminWalletOrderForm({ tenantId }: { tenantId: string }) {
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
      <h3 className="text-[1rem] font-semibold text-on-surface">创建充值单</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <InputField name="amount" placeholder="订单金额，例如 68" />
        <InputField name="credited_amount" placeholder="入账金额，可留空" />
        <InputField name="payment_provider" placeholder="支付提供方，例如 alipay" />
        <InputField name="payment_channel" placeholder="支付渠道，例如 qrcode" />
      </div>
      <InputField name="note" placeholder="备注，例如人工补单" />
      <FormStatus status={state.status} message={state.message} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.9rem] font-medium text-on-primary disabled:opacity-50"
      >
        {pending ? "提交中..." : "创建充值单"}
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
