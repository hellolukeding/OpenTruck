"use client";

import { useActionState, useEffect, useState } from "react";

import type { NodeModel } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import { deleteNodeModelAction, updateNodeModelAction } from "@/lib/admin-actions";
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

export function NodeModelRowActions({
  locale,
  nodeModel,
}: {
  locale: "en" | "zh-CN";
  nodeModel: NodeModel;
}) {
  const copy = getResourceAdminCopy(locale);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editState, editAction, editPending] = useActionState(updateNodeModelAction, idleState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteNodeModelAction, idleState);
  const [status, setStatus] = useState(nodeModel.status);

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
            <DialogTitle>{copy.models.editTitle}</DialogTitle>
            <DialogDescription>{copy.models.editDescription}</DialogDescription>
          </DialogHeader>
          <form action={editAction} className="grid gap-4">
            <input type="hidden" name="node_model_id" value={nodeModel.id} />
            <input type="hidden" name="locale" value={locale} />
            <div className="grid gap-2">
              <Label htmlFor={`node-model-public-${nodeModel.id}`}>{copy.models.labels.publicModel}</Label>
              <Input id={`node-model-public-${nodeModel.id}`} name="public_model" defaultValue={nodeModel.public_model} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`node-model-external-${nodeModel.id}`}>{copy.models.labels.externalModel}</Label>
              <Input id={`node-model-external-${nodeModel.id}`} name="external_model" defaultValue={nodeModel.external_model} required />
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor={`node-model-input-${nodeModel.id}`}>{copy.models.labels.input}</Label>
                <Input id={`node-model-input-${nodeModel.id}`} name="input_price" type="number" step="0.000001" defaultValue={nodeModel.input_price} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-model-output-${nodeModel.id}`}>{copy.models.labels.output}</Label>
                <Input id={`node-model-output-${nodeModel.id}`} name="output_price" type="number" step="0.000001" defaultValue={nodeModel.output_price} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-model-priority-${nodeModel.id}`}>{copy.models.labels.priority}</Label>
                <Input id={`node-model-priority-${nodeModel.id}`} name="priority" type="number" defaultValue={nodeModel.priority} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`node-model-status-${nodeModel.id}`}>{copy.models.labels.status}</Label>
              <select
                id={`node-model-status-${nodeModel.id}`}
                name="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
              >
                <option value="active">{copy.common.active}</option>
                <option value="disabled">{copy.common.disabled}</option>
              </select>
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
            <DialogTitle>{copy.models.deleteTitle}</DialogTitle>
            <DialogDescription>{copy.models.deleteDescription(nodeModel.public_model)}</DialogDescription>
          </DialogHeader>
          <form action={deleteAction} className="grid gap-4">
            <input type="hidden" name="node_model_id" value={nodeModel.id} />
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
