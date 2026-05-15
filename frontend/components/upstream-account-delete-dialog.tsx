"use client";

import { useActionState, useEffect } from "react";
import type { UpstreamAccount } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import { deleteUpstreamAccountAction } from "@/lib/admin-actions";
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
  const copy =
    locale === "zh-CN"
      ? {
          remove: "删除",
          cancel: "取消",
          confirmDelete: "确认删除",
          deleteTitle: "删除上游账号",
          deleteDescription: `删除后将把 ${account.name} 从租户账号池中移除。`,
        }
      : {
          remove: "Delete",
          cancel: "Cancel",
          confirmDelete: "Confirm Delete",
          deleteTitle: "Delete Upstream Account",
          deleteDescription: `This will remove ${account.name} from the tenant account pool.`,
        };

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
          {copy.remove}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.deleteTitle}</DialogTitle>
          <DialogDescription>{copy.deleteDescription}</DialogDescription>
        </DialogHeader>
        <form action={deleteAction} className="grid gap-4">
          <input type="hidden" name="account_id" value={account.id} />
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
