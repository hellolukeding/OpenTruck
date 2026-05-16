"use client";

import { useActionState, useEffect, useState } from "react";

import type { Tenant } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import { deleteTenantAction, updateTenantAction } from "@/lib/admin-actions";
import { getResourceAdminCopy } from "@/lib/resource-admin-copy";
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

export function TenantRowActions({
  locale,
  tenant,
}: {
  locale: "en" | "zh-CN";
  tenant: Tenant;
}) {
  const copy = getResourceAdminCopy(locale);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editState, editAction, editPending] = useActionState(updateTenantAction, idleState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteTenantAction, idleState);
  const [status, setStatus] = useState(tenant.status);

  useEffect(() => {
    if (editState.status === "success") {
      setEditOpen(false);
    }
  }, [editState.status]);

  useEffect(() => {
    if (deleteState.status === "success") {
      setDeleteOpen(false);
    }
  }, [deleteState.status]);

  return (
    <div className="flex items-center justify-end gap-xs">
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" type="button">
            {copy.common.edit}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.tenants.editTitle}</DialogTitle>
            <DialogDescription>{copy.tenants.editDescription}</DialogDescription>
          </DialogHeader>
          <form action={editAction} className="grid gap-4">
            <input type="hidden" name="tenant_id" value={tenant.id} />
            <input type="hidden" name="locale" value={locale} />
            <div className="grid gap-2">
              <Label htmlFor={`tenant-name-${tenant.id}`}>{copy.tenants.labels.name}</Label>
              <Input id={`tenant-name-${tenant.id}`} name="name" defaultValue={tenant.name} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`tenant-status-${tenant.id}`}>{copy.tenants.labels.status}</Label>
              <select
                id={`tenant-status-${tenant.id}`}
                name="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
              >
                <option value="active">{copy.common.active}</option>
                <option value="disabled">{copy.common.disabled}</option>
              </select>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor={`tenant-quota-${tenant.id}`}>{copy.tenants.labels.quota}</Label>
                <Input id={`tenant-quota-${tenant.id}`} name="quota_balance" type="number" step="0.01" defaultValue={tenant.quota_balance} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`tenant-rpm-${tenant.id}`}>{copy.tenants.labels.rpm}</Label>
                <Input id={`tenant-rpm-${tenant.id}`} name="rate_limit_rpm" type="number" defaultValue={tenant.rate_limit_rpm} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`tenant-tpm-${tenant.id}`}>{copy.tenants.labels.tpm}</Label>
                <Input id={`tenant-tpm-${tenant.id}`} name="rate_limit_tpm" type="number" defaultValue={tenant.rate_limit_tpm} />
              </div>
            </div>
            <FormStatus status={editState.status} message={editState.message} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
                {copy.common.cancel}
              </Button>
              <Button type="submit" disabled={editPending}>
                {copy.common.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" type="button" className="text-error hover:text-error">
            {copy.common.remove}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.tenants.deleteTitle}</DialogTitle>
            <DialogDescription>{copy.tenants.deleteDescription(tenant.name)}</DialogDescription>
          </DialogHeader>
          <form action={deleteAction} className="grid gap-4">
            <input type="hidden" name="tenant_id" value={tenant.id} />
            <input type="hidden" name="locale" value={locale} />
            <FormStatus status={deleteState.status} message={deleteState.message} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)}>
                {copy.common.cancel}
              </Button>
              <Button type="submit" disabled={deletePending}>
                {copy.common.confirmDelete}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
