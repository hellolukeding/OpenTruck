"use client";

import { useActionState, useEffect, useState } from "react";

import type { NodeModel } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import { deleteNodeModelAction, updateNodeModelAction } from "@/lib/admin-actions";
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
  const copy =
    locale === "zh-CN"
      ? {
          edit: "编辑",
          remove: "删除",
          save: "保存修改",
          cancel: "取消",
          confirmDelete: "确认删除",
          editTitle: "编辑模型路由",
          editDescription: "调整公开模型名、上游模型、优先级和定价。",
          deleteTitle: "删除模型路由",
          deleteDescription: `删除后将下线 ${nodeModel.public_model} 这条公开航线。`,
          active: "活跃",
          disabled: "禁用",
        }
      : {
          edit: "Edit",
          remove: "Delete",
          save: "Save changes",
          cancel: "Cancel",
          confirmDelete: "Confirm delete",
          editTitle: "Edit model route",
          editDescription: "Adjust public model naming, upstream binding, priority, and pricing.",
          deleteTitle: "Delete model route",
          deleteDescription: `This unpublishes ${nodeModel.public_model}.`,
          active: "Active",
          disabled: "Disabled",
        };

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
            {copy.edit}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.editTitle}</DialogTitle>
            <DialogDescription>{copy.editDescription}</DialogDescription>
          </DialogHeader>
          <form action={editAction} className="grid gap-4">
            <input type="hidden" name="node_model_id" value={nodeModel.id} />
            <div className="grid gap-2">
              <Label htmlFor={`node-model-public-${nodeModel.id}`}>Public model</Label>
              <Input id={`node-model-public-${nodeModel.id}`} name="public_model" defaultValue={nodeModel.public_model} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`node-model-external-${nodeModel.id}`}>External model</Label>
              <Input id={`node-model-external-${nodeModel.id}`} name="external_model" defaultValue={nodeModel.external_model} required />
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor={`node-model-input-${nodeModel.id}`}>Input</Label>
                <Input id={`node-model-input-${nodeModel.id}`} name="input_price" type="number" step="0.000001" defaultValue={nodeModel.input_price} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-model-output-${nodeModel.id}`}>Output</Label>
                <Input id={`node-model-output-${nodeModel.id}`} name="output_price" type="number" step="0.000001" defaultValue={nodeModel.output_price} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-model-priority-${nodeModel.id}`}>Priority</Label>
                <Input id={`node-model-priority-${nodeModel.id}`} name="priority" type="number" defaultValue={nodeModel.priority} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`node-model-status-${nodeModel.id}`}>Status</Label>
              <select
                id={`node-model-status-${nodeModel.id}`}
                name="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
              >
                <option value="active">{copy.active}</option>
                <option value="disabled">{copy.disabled}</option>
              </select>
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
            <input type="hidden" name="node_model_id" value={nodeModel.id} />
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
