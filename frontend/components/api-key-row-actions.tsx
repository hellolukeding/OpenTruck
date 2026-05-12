"use client";

import { useActionState, useEffect, useState } from "react";

import type { ApiKey } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import { deleteApiKeyAction, updateApiKeyAction } from "@/lib/admin-actions";
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
  const copy =
    locale === "zh-CN"
      ? {
          edit: "编辑",
          remove: "删除",
          save: "保存修改",
          cancel: "取消",
          confirmDelete: "确认删除",
          editTitle: "编辑 API 密钥",
          editDescription: "调整名称、状态、作用域，或轮换原始密钥。",
          deleteTitle: "删除 API 密钥",
          deleteDescription: `删除后将撤销 ${apiKey.name} 的访问权限。`,
          active: "活跃",
          disabled: "禁用",
          rawKeyHint: "留空则保持当前哈希不变",
        }
      : {
          edit: "Edit",
          remove: "Delete",
          save: "Save changes",
          cancel: "Cancel",
          confirmDelete: "Confirm delete",
          editTitle: "Edit API key",
          editDescription: "Adjust name, status, scope, or rotate the raw key.",
          deleteTitle: "Delete API key",
          deleteDescription: `This revokes ${apiKey.name}.`,
          active: "Active",
          disabled: "Disabled",
          rawKeyHint: "Leave blank to keep the current hash",
        };

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
            {copy.edit}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.editTitle}</DialogTitle>
            <DialogDescription>{copy.editDescription}</DialogDescription>
          </DialogHeader>
          <form action={editAction} className="grid gap-4">
            <input type="hidden" name="api_key_id" value={apiKey.id} />
            <div className="grid gap-2">
              <Label htmlFor={`api-key-name-${apiKey.id}`}>Name</Label>
              <Input id={`api-key-name-${apiKey.id}`} name="name" defaultValue={apiKey.name} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`api-key-status-${apiKey.id}`}>Status</Label>
              <select
                id={`api-key-status-${apiKey.id}`}
                name="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
              >
                <option value="active">{copy.active}</option>
                <option value="disabled">{copy.disabled}</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`api-key-raw-${apiKey.id}`}>Raw key</Label>
              <Input id={`api-key-raw-${apiKey.id}`} name="raw_key" placeholder={copy.rawKeyHint} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`api-key-scope-${apiKey.id}`}>Scope JSON</Label>
              <Textarea id={`api-key-scope-${apiKey.id}`} name="scope" defaultValue={JSON.stringify(apiKey.scope, null, 2)} />
            </div>
            <FormStatus status={editState.status} message={editState.message} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
                {copy.cancel}
              </Button>
              <Button type="submit" disabled={editPending}>
                {copy.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
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
            <input type="hidden" name="api_key_id" value={apiKey.id} />
            <FormStatus status={deleteState.status} message={deleteState.message} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)}>
                {copy.cancel}
              </Button>
              <Button type="submit" disabled={deletePending}>
                {copy.confirmDelete}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
