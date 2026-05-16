"use client";

import { useActionState, useEffect, useRef } from "react";

import { FormStatus } from "@/components/form-status";
import { type ConsoleActionState } from "@/lib/admin-console-actions";
import { createAnnouncementAction } from "@/lib/admin-console-announcement-actions";

const idleState: ConsoleActionState = { status: "idle" };

export function AdminAnnouncementForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(createAnnouncementAction, idleState);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={action} className="space-y-3 rounded-[20px] border border-outline-variant/20 bg-surface p-5 dark:bg-surface-container-low">
      <h3 className="text-[1rem] font-semibold text-on-surface">新增公告</h3>
      <input name="title" placeholder="公告标题" className="h-11 w-full rounded-[12px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.88rem] text-on-surface dark:bg-surface" />
      <textarea name="body" placeholder="公告正文" className="min-h-[140px] w-full rounded-[16px] border border-outline-variant/20 bg-surface-container-low px-4 py-4 text-[0.9rem] text-on-surface dark:bg-surface" />
      <div className="grid gap-3 md:grid-cols-3">
        <SelectField name="status" options={["published", "draft", "archived"]} />
        <SelectField name="severity" options={["info", "success", "warning", "error"]} />
        <input name="sort_order" defaultValue="100" className="h-11 rounded-[12px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.88rem] text-on-surface dark:bg-surface" />
      </div>
      <label className="flex items-center gap-2 text-[0.84rem] text-on-surface">
        <input type="checkbox" name="is_pinned" />
        设为置顶公告
      </label>
      <FormStatus status={state.status} message={state.message} />
      <button type="submit" disabled={pending} className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.9rem] font-medium text-on-primary disabled:opacity-50">
        {pending ? "提交中..." : "创建公告"}
      </button>
    </form>
  );
}

function SelectField({ name, options }: { name: string; options: string[] }) {
  return (
    <select name={name} defaultValue={options[0]} className="h-11 rounded-[12px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.88rem] text-on-surface dark:bg-surface">
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
