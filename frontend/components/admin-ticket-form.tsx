"use client";

import { useActionState, useEffect, useRef } from "react";

import { createSupportTicketAction, type ConsoleActionState } from "@/lib/admin-console-actions";
import { FormStatus } from "@/components/form-status";

export function AdminTicketForm({ tenantId }: { tenantId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: ConsoleActionState = { status: "idle" };
  const [state, action, pending] = useActionState(createSupportTicketAction, initialState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={action} className="mt-4 space-y-3">
      <input type="hidden" name="tenant_id" value={tenantId} />
      <InputField name="subject" label="问题标题" placeholder="例如：钱包入账异常" />
      <InputField name="category" label="问题类型" placeholder="支付、路由、模型、账单、账号" />
      <InputField name="priority" label="优先级" placeholder="normal / urgent / critical" />
      <InputField name="contact_email" label="联系邮箱" placeholder="operator@company.com" />
      <TextAreaField
        name="description"
        label="问题描述"
        placeholder="请尽量提供错误时间、令牌名称、模型名称和 request id，方便快速定位。"
      />
      <FormStatus status={state.status} message={state.message} />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[16px] bg-primary-container px-4 py-3 text-[0.92rem] font-medium text-on-primary disabled:opacity-50"
      >
        {pending ? "提交中..." : "提交工单"}
      </button>
    </form>
  );
}

function InputField({
  name,
  label,
  placeholder,
}: {
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <p className="mb-2 text-[0.88rem] font-medium text-on-surface">{label}</p>
      <input
        name={name}
        placeholder={placeholder}
        className="h-12 w-full rounded-[14px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.9rem] text-on-surface-variant dark:bg-surface"
      />
    </div>
  );
}

function TextAreaField({
  name,
  label,
  placeholder,
}: {
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <p className="mb-2 text-[0.88rem] font-medium text-on-surface">{label}</p>
      <textarea
        name={name}
        placeholder={placeholder}
        className="min-h-[160px] w-full rounded-[16px] border border-outline-variant/20 bg-surface-container-low px-4 py-4 text-[0.9rem] text-on-surface-variant dark:bg-surface"
      />
    </div>
  );
}
