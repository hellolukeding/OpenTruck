"use client";

import { useActionState, useEffect } from "react";
import type { UpstreamAccount } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import { refreshUpstreamAccountAction } from "@/lib/admin-actions";
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

interface UpstreamAccountRefreshDialogProps {
  locale: "en" | "zh-CN";
  account: UpstreamAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpstreamAccountRefreshDialog({
  locale,
  account,
  open,
  onOpenChange,
}: UpstreamAccountRefreshDialogProps) {
  const copy =
    locale === "zh-CN"
      ? {
          refresh: "刷新",
          cancel: "取消",
          runRefresh: "立即刷新 Token",
          refreshTitle: "刷新上游账号",
          refreshDescription: `尝试为 ${account.name} 拉取新的 access token。`,
        }
      : {
          refresh: "Refresh",
          cancel: "Cancel",
          runRefresh: "Refresh Token Now",
          refreshTitle: "Refresh Upstream Account",
          refreshDescription: `Attempt to fetch a new access token for ${account.name}.`,
        };

  const [refreshState, refreshAction, refreshPending] = useActionState(
    refreshUpstreamAccountAction,
    idleState
  );

  useEffect(() => {
    if (refreshState.status === "success") {
      onOpenChange(false);
    }
  }, [refreshState.status, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" type="button">
          {copy.refresh}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.refreshTitle}</DialogTitle>
          <DialogDescription>{copy.refreshDescription}</DialogDescription>
        </DialogHeader>
        <form action={refreshAction} className="grid gap-4">
          <input type="hidden" name="account_id" value={account.id} />
          <FormStatus status={refreshState.status} message={refreshState.message} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {copy.cancel}
            </Button>
            <Button type="submit" disabled={refreshPending}>
              {copy.runRefresh}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
