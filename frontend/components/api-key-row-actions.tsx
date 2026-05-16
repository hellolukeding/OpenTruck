"use client";

import { useActionState, useEffect, useState } from "react";

import type { ApiKey } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import { deleteApiKeyAction, updateApiKeyAction } from "@/lib/admin-actions";
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
import { Textarea } from "@/components/ui/textarea";

const idleState: AdminActionState = { status: "idle" };

export function ApiKeyRowActions({
  locale,
  apiKey,
}: {
  locale: "en" | "zh-CN";
  apiKey: ApiKey;
}) {
  const copy = getResourceAdminCopy(locale);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editState, editAction, editPending] = useActionState(updateApiKeyAction, idleState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteApiKeyAction, idleState);
  const [status, setStatus] = useState(apiKey.status);

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
            <DialogTitle>{copy.apiKeys.editTitle}</DialogTitle>
            <DialogDescription>{copy.apiKeys.editDescription}</DialogDescription>
          </DialogHeader>
          <form action={editAction} className="grid gap-4">
            <input type="hidden" name="api_key_id" value={apiKey.id} />
            <input type="hidden" name="locale" value={locale} />
            <div className="grid gap-2">
              <Label htmlFor={`api-key-name-${apiKey.id}`}>{copy.apiKeys.labels.name}</Label>
              <Input id={`api-key-name-${apiKey.id}`} name="name" defaultValue={apiKey.name} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`api-key-status-${apiKey.id}`}>{copy.apiKeys.labels.status}</Label>
              <select
                id={`api-key-status-${apiKey.id}`}
                name="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
              >
                <option value="active">{copy.common.active}</option>
                <option value="disabled">{copy.common.disabled}</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`api-key-raw-${apiKey.id}`}>{copy.apiKeys.labels.rawKey}</Label>
              <Input id={`api-key-raw-${apiKey.id}`} name="raw_key" placeholder={copy.apiKeys.rawKeyHint} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`api-key-scope-${apiKey.id}`}>{copy.apiKeys.labels.scopeJson}</Label>
              <Textarea id={`api-key-scope-${apiKey.id}`} name="scope" defaultValue={JSON.stringify(apiKey.scope, null, 2)} />
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
            <DialogTitle>{copy.apiKeys.deleteTitle}</DialogTitle>
            <DialogDescription>{copy.apiKeys.deleteDescription(apiKey.name)}</DialogDescription>
          </DialogHeader>
          <form action={deleteAction} className="grid gap-4">
            <input type="hidden" name="api_key_id" value={apiKey.id} />
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
