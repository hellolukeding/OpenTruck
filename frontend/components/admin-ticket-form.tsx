"use client";

import { useActionState, useEffect, useRef } from "react";

import { FormStatus } from "@/components/form-status";
import { createSupportTicketAction, type ConsoleActionState } from "@/lib/admin-console-actions";
import type { TicketsPageCopy } from "@/lib/tickets-page-copy";

export function AdminTicketForm({
  copy,
  tenantId,
}: {
  copy: TicketsPageCopy;
  tenantId: string;
}) {
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
      <InputField name="subject" label={copy.form.subjectLabel} placeholder={copy.form.subjectPlaceholder} />
      <InputField name="category" label={copy.form.categoryLabel} placeholder={copy.form.categoryPlaceholder} />
      <InputField name="priority" label={copy.form.priorityLabel} placeholder={copy.form.priorityPlaceholder} />
      <InputField name="contact_email" label={copy.form.contactLabel} placeholder={copy.form.contactPlaceholder} />
      <TextAreaField
        name="description"
        label={copy.form.descriptionLabel}
        placeholder={copy.form.descriptionPlaceholder}
      />
      <FormStatus status={state.status} message={state.message} />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[16px] bg-primary-container px-4 py-3 text-[0.92rem] font-medium text-on-primary disabled:opacity-50"
      >
        {pending ? copy.form.submitting : copy.form.submit}
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
