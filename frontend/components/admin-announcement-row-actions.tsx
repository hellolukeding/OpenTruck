"use client";

import { useActionState, useEffect, useState } from "react";

import { FormStatus } from "@/components/form-status";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Announcement } from "@/lib/admin-console-api";
import { type ConsoleActionState } from "@/lib/admin-console-actions";
import { deleteAnnouncementAction, updateAnnouncementAction } from "@/lib/admin-console-announcement-actions";
import type { AnnouncementsPageCopy } from "@/lib/announcements-page-copy";
import type { Locale } from "@/lib/i18n";

const idleState: ConsoleActionState = { status: "idle" };

export function AdminAnnouncementRowActions({
  announcement,
  copy,
  locale,
}: {
  announcement: Announcement;
  copy: AnnouncementsPageCopy;
  locale: Locale;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editState, editAction, editPending] = useActionState(updateAnnouncementAction, idleState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteAnnouncementAction, idleState);

  useEffect(() => {
    if (editState.status === "success") setEditOpen(false);
  }, [editState.status]);
  useEffect(() => {
    if (deleteState.status === "success") setDeleteOpen(false);
  }, [deleteState.status]);

  return (
    <div className="flex items-center gap-2">
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <button type="button" className="text-[0.78rem] font-medium text-primary">{copy.row.edit}</button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{copy.row.editTitle}</DialogTitle>
            <DialogDescription>{copy.row.editDescription}</DialogDescription>
          </DialogHeader>
          <form action={editAction} className="grid gap-4">
            <input type="hidden" name="announcement_id" value={announcement.id} />
            <input type="hidden" name="locale" value={locale} />
            <input name="title" defaultValue={announcement.title} className="h-11 rounded-[12px] border border-outline-variant/20 bg-surface px-4 text-[0.88rem] text-on-surface dark:bg-surface-container-low" />
            <textarea name="body" defaultValue={announcement.body} className="min-h-[160px] rounded-[16px] border border-outline-variant/20 bg-surface px-4 py-4 text-[0.9rem] text-on-surface dark:bg-surface-container-low" />
            <div className="grid gap-3 md:grid-cols-3">
              <SelectField name="status" defaultValue={announcement.status} labels={copy.enums.status} options={["published", "draft", "archived"]} />
              <SelectField name="severity" defaultValue={announcement.severity} labels={copy.enums.severity} options={["info", "success", "warning", "error"]} />
              <input name="sort_order" defaultValue={String(announcement.sort_order)} className="h-11 rounded-[12px] border border-outline-variant/20 bg-surface px-4 text-[0.88rem] text-on-surface dark:bg-surface-container-low" />
            </div>
            <label className="flex items-center gap-2 text-[0.84rem] text-on-surface">
              <input type="checkbox" name="is_pinned" defaultChecked={announcement.is_pinned} />
              {copy.form.pinned}
            </label>
            <FormStatus status={editState.status} message={editState.message} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>{copy.row.cancel}</Button>
              <Button type="submit" disabled={editPending}>{editPending ? copy.row.saving : copy.row.save}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <button type="button" className="text-[0.78rem] font-medium text-error">{copy.row.delete}</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.row.deleteTitle}</DialogTitle>
            <DialogDescription>{copy.row.deleteDescription(announcement.title)}</DialogDescription>
          </DialogHeader>
          <form action={deleteAction} className="grid gap-4">
            <input type="hidden" name="announcement_id" value={announcement.id} />
            <input type="hidden" name="locale" value={locale} />
            <FormStatus status={deleteState.status} message={deleteState.message} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)}>{copy.row.cancel}</Button>
              <Button type="submit" disabled={deletePending}>{deletePending ? copy.row.deleting : copy.row.confirmDelete}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
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
    <select name={name} defaultValue={defaultValue} className="h-11 rounded-[12px] border border-outline-variant/20 bg-surface px-4 text-[0.88rem] text-on-surface dark:bg-surface-container-low">
      {options.map((option) => (
        <option key={option} value={option}>
          {labels[option] ?? option}
        </option>
      ))}
    </select>
  );
}
