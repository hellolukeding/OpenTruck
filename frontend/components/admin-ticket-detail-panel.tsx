"use client";

import { useActionState, useEffect, useRef } from "react";

import { FormStatus } from "@/components/form-status";
import type { SupportTicketDetail } from "@/lib/admin-console-api";
import {
  createSupportTicketMessageAction,
  type ConsoleActionState,
  updateSupportTicketAction,
} from "@/lib/admin-console-actions";
import type { TicketsPageCopy } from "@/lib/tickets-page-copy";

const idleState: ConsoleActionState = { status: "idle" };

export function AdminTicketDetailPanel({
  copy,
  ticket,
}: {
  copy: TicketsPageCopy;
  ticket: SupportTicketDetail | null;
}) {
  const replyFormRef = useRef<HTMLFormElement>(null);
  const [replyState, replyAction, replyPending] = useActionState(createSupportTicketMessageAction, idleState);
  const [statusState, statusAction, statusPending] = useActionState(updateSupportTicketAction, idleState);

  useEffect(() => {
    if (replyState.status === "success") replyFormRef.current?.reset();
  }, [replyState.status]);

  if (!ticket) {
    return (
      <section className="rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm dark:bg-surface-container-low/60">
        <p className="text-[1rem] font-semibold text-on-surface">{copy.detail.threadTitle}</p>
        <p className="mt-3 text-[0.92rem] text-on-surface-variant">{copy.detail.threadEmpty}</p>
      </section>
    );
  }

  return (
    <section className="space-y-5 rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm dark:bg-surface-container-low/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[1.08rem] font-semibold text-on-surface">{ticket.subject}</p>
          <p className="mt-1 text-[0.84rem] text-on-surface-variant">
            {ticket.ticket_number} / {ticket.category} / {ticket.contact_email}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[0.75rem]">
          <span className="rounded-full border border-outline-variant/20 px-3 py-1 text-on-surface-variant">
            {labelFor(copy.enums.priority, ticket.priority)}
          </span>
          <span className="rounded-full bg-primary-container px-3 py-1 text-on-primary">
            {labelFor(copy.enums.status, ticket.status)}
          </span>
        </div>
      </div>

      <form action={statusAction} className="grid gap-3 rounded-[18px] border border-outline-variant/20 bg-surface p-4 md:grid-cols-[1fr_1fr_auto] dark:bg-surface-container-low">
        <input type="hidden" name="ticket_id" value={ticket.id} />
        <SelectField name="status" defaultValue={ticket.status} options={["open", "processing", "resolved"]} labels={copy.enums.status} />
        <SelectField name="priority" defaultValue={ticket.priority} options={["low", "normal", "urgent", "critical"]} labels={copy.enums.priority} />
        <button
          type="submit"
          disabled={statusPending}
          className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.88rem] font-medium text-on-primary disabled:opacity-50"
        >
          {statusPending ? copy.detail.updating : copy.detail.update}
        </button>
        <div className="md:col-span-3">
          <FormStatus status={statusState.status} message={statusState.message} />
        </div>
      </form>

      <div className="space-y-3">
        {ticket.messages.length > 0 ? (
          ticket.messages.map((message) => (
            <div key={message.id} className="rounded-[18px] border border-outline-variant/20 bg-surface px-4 py-4 dark:bg-surface-container-low">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.88rem] font-semibold text-on-surface">
                  {message.author_name || labelFor(copy.enums.authorType, message.author_type)}
                </p>
                <span className="text-[0.76rem] text-on-surface-variant">
                  {new Date(message.created_at).toLocaleString(copy.detail.dateLocale, { hour12: false })}
                </span>
              </div>
              <p className="mt-1 text-[0.78rem] text-on-surface-variant">
                {labelFor(copy.enums.authorType, message.author_type)}
                {message.is_internal ? copy.detail.internalSuffix : ""}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-[0.9rem] leading-7 text-on-surface">{message.body}</p>
            </div>
          ))
        ) : (
          <div className="rounded-[18px] border border-dashed border-outline-variant/30 px-4 py-8 text-center text-[0.9rem] text-on-surface-variant">
            {copy.detail.noMessages}
          </div>
        )}
      </div>

      <form ref={replyFormRef} action={replyAction} className="space-y-3 rounded-[18px] border border-outline-variant/20 bg-surface p-4 dark:bg-surface-container-low">
        <input type="hidden" name="ticket_id" value={ticket.id} />
        <div className="grid gap-3 md:grid-cols-2">
          <SelectField name="author_type" defaultValue="operator" options={["operator", "customer", "system"]} labels={copy.enums.authorType} />
          <input
            name="author_name"
            placeholder={copy.detail.authorNamePlaceholder}
            className="h-11 rounded-[12px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.88rem] text-on-surface dark:bg-surface"
          />
          <SelectField name="status" defaultValue={ticket.status} options={["open", "processing", "resolved"]} labels={copy.enums.status} />
          <SelectField name="priority" defaultValue={ticket.priority} options={["low", "normal", "urgent", "critical"]} labels={copy.enums.priority} />
        </div>
        <label className="flex items-center gap-2 text-[0.84rem] text-on-surface">
          <input type="checkbox" name="is_internal" />
          {copy.detail.internalLabel}
        </label>
        <textarea
          name="body"
          placeholder={copy.detail.replyPlaceholder}
          className="min-h-[160px] w-full rounded-[16px] border border-outline-variant/20 bg-surface-container-low px-4 py-4 text-[0.9rem] text-on-surface dark:bg-surface"
        />
        <FormStatus status={replyState.status} message={replyState.message} />
        <button
          type="submit"
          disabled={replyPending}
          className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.9rem] font-medium text-on-primary disabled:opacity-50"
        >
          {replyPending ? copy.detail.sending : copy.detail.send}
        </button>
      </form>
    </section>
  );
}

function SelectField({
  name,
  defaultValue,
  labels,
  options,
}: {
  name: string;
  defaultValue: string;
  labels: Record<string, string>;
  options: string[];
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="h-11 rounded-[12px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.88rem] text-on-surface dark:bg-surface"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {labelFor(labels, option)}
        </option>
      ))}
    </select>
  );
}

function labelFor(labels: Record<string, string>, value: string) {
  return labels[value] ?? value;
}
