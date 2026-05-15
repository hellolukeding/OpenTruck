"use client";

import { useActionState, useEffect, useRef } from "react";

import { FormStatus } from "@/components/form-status";
import type { SupportTicketDetail } from "@/lib/admin-console-api";
import {
  createSupportTicketMessageAction,
  type ConsoleActionState,
  updateSupportTicketAction,
} from "@/lib/admin-console-actions";

const idleState: ConsoleActionState = { status: "idle" };

export function AdminTicketDetailPanel({ ticket }: { ticket: SupportTicketDetail | null }) {
  const replyFormRef = useRef<HTMLFormElement>(null);
  const [replyState, replyAction, replyPending] = useActionState(createSupportTicketMessageAction, idleState);
  const [statusState, statusAction, statusPending] = useActionState(updateSupportTicketAction, idleState);

  useEffect(() => {
    if (replyState.status === "success") replyFormRef.current?.reset();
  }, [replyState.status]);

  if (!ticket) {
    return (
      <section className="rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm dark:bg-surface-container-low/60">
        <p className="text-[1rem] font-semibold text-on-surface">工单线程</p>
        <p className="mt-3 text-[0.92rem] text-on-surface-variant">从左侧选择一张工单后，这里会显示完整对话和处理动作。</p>
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
          <span className="rounded-full border border-outline-variant/20 px-3 py-1 text-on-surface-variant">{ticket.priority}</span>
          <span className="rounded-full bg-primary-container px-3 py-1 text-on-primary">{ticket.status}</span>
        </div>
      </div>

      <form action={statusAction} className="grid gap-3 rounded-[18px] border border-outline-variant/20 bg-surface p-4 md:grid-cols-[1fr_1fr_auto] dark:bg-surface-container-low">
        <input type="hidden" name="ticket_id" value={ticket.id} />
        <SelectField name="status" defaultValue={ticket.status} options={["open", "processing", "resolved"]} />
        <SelectField name="priority" defaultValue={ticket.priority} options={["low", "normal", "urgent", "critical"]} />
        <button
          type="submit"
          disabled={statusPending}
          className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.88rem] font-medium text-on-primary disabled:opacity-50"
        >
          {statusPending ? "更新中..." : "更新状态"}
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
                  {message.author_name || message.author_type}
                </p>
                <span className="text-[0.76rem] text-on-surface-variant">
                  {new Date(message.created_at).toLocaleString("zh-CN", { hour12: false })}
                </span>
              </div>
              <p className="mt-1 text-[0.78rem] text-on-surface-variant">
                {message.author_type}
                {message.is_internal ? " / internal" : ""}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-[0.9rem] leading-7 text-on-surface">{message.body}</p>
            </div>
          ))
        ) : (
          <div className="rounded-[18px] border border-dashed border-outline-variant/30 px-4 py-8 text-center text-[0.9rem] text-on-surface-variant">
            这张工单还没有后续回复，先补一条处理记录吧。
          </div>
        )}
      </div>

      <form ref={replyFormRef} action={replyAction} className="space-y-3 rounded-[18px] border border-outline-variant/20 bg-surface p-4 dark:bg-surface-container-low">
        <input type="hidden" name="ticket_id" value={ticket.id} />
        <div className="grid gap-3 md:grid-cols-2">
          <SelectField name="author_type" defaultValue="operator" options={["operator", "customer", "system"]} />
          <input
            name="author_name"
            placeholder="处理人，如 OpenTruck Support"
            className="h-11 rounded-[12px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.88rem] text-on-surface dark:bg-surface"
          />
          <SelectField name="status" defaultValue={ticket.status} options={["open", "processing", "resolved"]} />
          <SelectField name="priority" defaultValue={ticket.priority} options={["low", "normal", "urgent", "critical"]} />
        </div>
        <label className="flex items-center gap-2 text-[0.84rem] text-on-surface">
          <input type="checkbox" name="is_internal" />
          记为内部备注，不对外显示语义标签
        </label>
        <textarea
          name="body"
          placeholder="补充排查进展、索取 request id，或同步已完成的处理动作。"
          className="min-h-[160px] w-full rounded-[16px] border border-outline-variant/20 bg-surface-container-low px-4 py-4 text-[0.9rem] text-on-surface dark:bg-surface"
        />
        <FormStatus status={replyState.status} message={replyState.message} />
        <button
          type="submit"
          disabled={replyPending}
          className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.9rem] font-medium text-on-primary disabled:opacity-50"
        >
          {replyPending ? "发送中..." : "发送回复"}
        </button>
      </form>
    </section>
  );
}

function SelectField({
  name,
  defaultValue,
  options,
}: {
  name: string;
  defaultValue: string;
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
          {option}
        </option>
      ))}
    </select>
  );
}
