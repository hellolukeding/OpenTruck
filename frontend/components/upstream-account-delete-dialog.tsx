"use client";

import { useActionState, useEffect } from "react";
import type { UpstreamAccount } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import { deleteUpstreamAccountAction } from "@/lib/admin-actions";
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

const idleState: AdminActionState = { status: "idle" };

interface UpstreamAccountDeleteDialogProps {
  locale: "en" | "zh-CN";
  account: UpstreamAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpstreamAccountDeleteDialog({
  locale,
  account,
  open,
  onOpenChange,
}: UpstreamAccountDeleteDialogProps) {
  const copy = getUpstreamAccountsPageCopy(locale).dialogs;

  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteUpstreamAccountAction,
    idleState
  );

  useEffect(() => {
    if (deleteState.status === "success") {
      onOpenChange(false);
    }
  }, [deleteState.status, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" type="button" className="text-error hover:text-error">
          {copy.delete}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.deleteTitle}</DialogTitle>
          <DialogDescription>{copy.deleteDescription(account.name)}</DialogDescription>
        </DialogHeader>
        <form action={deleteAction} className="grid gap-4">
          <input type="hidden" name="account_id" value={account.id} />
          <input type="hidden" name="locale" value={locale} />
          <FormStatus status={deleteState.status} message={deleteState.message} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {copy.cancel}
            </Button>
            <Button type="submit" disabled={deletePending}>
              {copy.confirmDelete}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
