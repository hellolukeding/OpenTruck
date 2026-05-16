"use client";

import { useActionState, useEffect } from "react";
import type { UpstreamAccount } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import { updateUpstreamAccountAction } from "@/lib/admin-actions";
import { toDateTimeLocal } from "@/lib/date-formatters";
import { getUpstreamAccountsPageCopy } from "@/lib/upstream-accounts-page-copy";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const idleState: AdminActionState = { status: "idle" };

interface UpstreamAccountEditDialogProps {
  locale: "en" | "zh-CN";
  account: UpstreamAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpstreamAccountEditDialog({
  locale,
  account,
  open,
  onOpenChange,
}: UpstreamAccountEditDialogProps) {
  const copy = getUpstreamAccountsPageCopy(locale).dialogs;

  const [editState, editAction, editPending] = useActionState(updateUpstreamAccountAction, idleState);

  useEffect(() => {
    if (editState.status === "success") {
      onOpenChange(false);
    }
  }, [editState.status, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" type="button">
          {copy.edit}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.editTitle}</DialogTitle>
          <DialogDescription>{copy.editDescription}</DialogDescription>
        </DialogHeader>
        <form action={editAction} className="grid gap-4">
          <input type="hidden" name="account_id" value={account.id} />
          <input type="hidden" name="locale" value={locale} />
          <div className="grid gap-2">
            <Label htmlFor="edit-status">{copy.fields.status}</Label>
            <Input id="edit-status" name="status" defaultValue={account.status} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-priority">{copy.fields.priority}</Label>
            <Input id="edit-priority" name="priority" type="number" defaultValue={account.priority} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-consecutive-failures">{copy.fields.consecutiveFailures}</Label>
            <Input
              id="edit-consecutive-failures"
              name="consecutive_failures"
              type="number"
              defaultValue={account.consecutive_failures}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-cooldown-until">{copy.fields.cooldownUntil}</Label>
            <Input
              id="edit-cooldown-until"
              name="cooldown_until"
              type="datetime-local"
              defaultValue={toDateTimeLocal(account.cooldown_until)}
            />
          </div>
          <FormStatus status={editState.status} message={editState.message} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {copy.cancel}
            </Button>
            <Button type="submit" disabled={editPending}>
              {editPending ? copy.save : copy.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
