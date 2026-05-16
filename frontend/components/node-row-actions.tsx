"use client";

import { useActionState, useEffect, useState } from "react";

import type { Node } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import { deleteNodeAction, updateNodeAction } from "@/lib/admin-actions";
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

export function NodeRowActions({
  locale,
  node,
}: {
  locale: "en" | "zh-CN";
  node: Node;
}) {
  const copy = getResourceAdminCopy(locale);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editState, editAction, editPending] = useActionState(updateNodeAction, idleState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteNodeAction, idleState);
  const [status, setStatus] = useState(node.status);
  const [healthStatus, setHealthStatus] = useState(node.health_status);

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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{copy.nodes.editTitle}</DialogTitle>
            <DialogDescription>{copy.nodes.editDescription}</DialogDescription>
          </DialogHeader>
          <form action={editAction} className="grid gap-4">
            <input type="hidden" name="node_id" value={node.id} />
            <input type="hidden" name="locale" value={locale} />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor={`node-name-${node.id}`}>{copy.nodes.labels.name}</Label>
                <Input id={`node-name-${node.id}`} name="name" defaultValue={node.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-base-${node.id}`}>{copy.nodes.labels.baseUrl}</Label>
                <Input id={`node-base-${node.id}`} name="base_url" defaultValue={node.base_url} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-region-${node.id}`}>{copy.nodes.labels.region}</Label>
                <Input id={`node-region-${node.id}`} name="region" defaultValue={node.region} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-auth-${node.id}`}>{copy.nodes.labels.authType}</Label>
                <Input id={`node-auth-${node.id}`} name="auth_type" defaultValue={node.auth_type} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-status-${node.id}`}>{copy.nodes.labels.status}</Label>
                <select
                  id={`node-status-${node.id}`}
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
                <Label htmlFor={`node-health-${node.id}`}>{copy.nodes.labels.health}</Label>
                <select
                  id={`node-health-${node.id}`}
                  name="health_status"
                  value={healthStatus}
                  onChange={(event) => setHealthStatus(event.target.value)}
                className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
              >
                  <option value="unknown">{copy.nodes.health.unknown}</option>
                  <option value="ok">{copy.nodes.health.ok}</option>
                  <option value="degraded">{copy.nodes.health.degraded}</option>
                  <option value="down">{copy.nodes.health.down}</option>
                  <option value="error">{copy.nodes.health.error}</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-weight-${node.id}`}>{copy.nodes.labels.weight}</Label>
                <Input id={`node-weight-${node.id}`} name="weight" type="number" defaultValue={node.weight} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-concurrency-${node.id}`}>{copy.nodes.labels.concurrency}</Label>
                <Input id={`node-concurrency-${node.id}`} name="max_concurrency" type="number" defaultValue={node.max_concurrency} />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor={`node-tags-${node.id}`}>{copy.nodes.labels.tags}</Label>
                <Input id={`node-tags-${node.id}`} name="tags" defaultValue={node.tags.join(", ")} />
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
            <DialogTitle>{copy.nodes.deleteTitle}</DialogTitle>
            <DialogDescription>{copy.nodes.deleteDescription(node.name)}</DialogDescription>
          </DialogHeader>
          <form action={deleteAction} className="grid gap-4">
            <input type="hidden" name="node_id" value={node.id} />
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
