"use client";

import { useActionState, useEffect, useRef } from "react";

import { FormStatus } from "@/components/form-status";
import { type ConsoleActionState } from "@/lib/admin-console-actions";
import { createAnnouncementAction } from "@/lib/admin-console-announcement-actions";
import type { AnnouncementsPageCopy } from "@/lib/announcements-page-copy";
import type { Locale } from "@/lib/i18n";

const idleState: ConsoleActionState = { status: "idle" };

export function AdminAnnouncementForm({
  copy,
  locale,
}: {
  copy: AnnouncementsPageCopy;
  locale: Locale;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(createAnnouncementAction, idleState);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={action} className="space-y-3 rounded-[20px] border border-outline-variant/20 bg-surface p-5 dark:bg-surface-container-low">
      <input type="hidden" name="locale" value={locale} />
      <h3 className="text-[1rem] font-semibold text-on-surface">{copy.form.title}</h3>
      <input name="title" placeholder={copy.form.titlePlaceholder} className="h-11 w-full rounded-[12px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.88rem] text-on-surface dark:bg-surface" />
      <textarea name="body" placeholder={copy.form.bodyPlaceholder} className="min-h-[140px] w-full rounded-[16px] border border-outline-variant/20 bg-surface-container-low px-4 py-4 text-[0.9rem] text-on-surface dark:bg-surface" />
      <div className="grid gap-3 md:grid-cols-3">
        <SelectField name="status" labels={copy.enums.status} options={["published", "draft", "archived"]} />
        <SelectField name="severity" labels={copy.enums.severity} options={["info", "success", "warning", "error"]} />
        <input name="sort_order" defaultValue="100" placeholder={copy.form.sortOrderPlaceholder} className="h-11 rounded-[12px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.88rem] text-on-surface dark:bg-surface" />
      </div>
      <label className="flex items-center gap-2 text-[0.84rem] text-on-surface">
        <input type="checkbox" name="is_pinned" />
        {copy.form.pinned}
      </label>
      <FormStatus status={state.status} message={state.message} />
      <button type="submit" disabled={pending} className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.9rem] font-medium text-on-primary disabled:opacity-50">
        {pending ? copy.form.submitting : copy.form.submit}
      </button>
    </form>
  );
}

function SelectField({
  name,
  labels,
  options,
}: {
  name: string;
  labels: Record<string, string>;
  options: string[];
}) {
  return (
    <select name={name} defaultValue={options[0]} className="h-11 rounded-[12px] border border-outline-variant/20 bg-surface-container-low px-4 text-[0.88rem] text-on-surface dark:bg-surface">
      {options.map((option) => (
        <option key={option} value={option}>
          {labels[option] ?? option}
        </option>
      ))}
    </select>
  );
}
