"use client";

import { useState } from "react";
import type { UpstreamAccount } from "@/lib/admin-api";
import { UpstreamAccountDetailsDialog } from "@/components/upstream-account-details-dialog";
import { UpstreamAccountEditDialog } from "@/components/upstream-account-edit-dialog";
import { UpstreamAccountRefreshDialog } from "@/components/upstream-account-refresh-dialog";
import { UpstreamAccountDeleteDialog } from "@/components/upstream-account-delete-dialog";

export function UpstreamAccountRowActions({
  locale,
  account,
}: {
  locale: "en" | "zh-CN";
  account: UpstreamAccount;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [refreshOpen, setRefreshOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <UpstreamAccountDetailsDialog
        locale={locale}
        account={account}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
      <UpstreamAccountEditDialog
        locale={locale}
        account={account}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <UpstreamAccountRefreshDialog
        locale={locale}
        account={account}
        open={refreshOpen}
        onOpenChange={setRefreshOpen}
      />
      <UpstreamAccountDeleteDialog
        locale={locale}
        account={account}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
