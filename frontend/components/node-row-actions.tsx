"use client";

import { useActionState, useEffect, useState } from "react";

import type { Node } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import { deleteNodeAction, updateNodeAction } from "@/lib/admin-actions";
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
  const copy =
    locale === "zh-CN"
      ? {
          edit: "编辑",
          remove: "删除",
          save: "保存修改",
          cancel: "取消",
          confirmDelete: "确认删除",
          editTitle: "编辑节点",
          editDescription: "更新节点的路由元信息、健康状态和容量配置。",
          deleteTitle: "删除节点",
          deleteDescription: `删除后将移除 ${node.name} 及其模型路由。`,
          active: "活跃",
          disabled: "禁用",
          unknown: "未知",
          ok: "正常",
          degraded: "降级",
          down: "离线",
          error: "错误",
        }
      : {
          edit: "Edit",
          remove: "Delete",
          save: "Save changes",
          cancel: "Cancel",
          confirmDelete: "Confirm delete",
          editTitle: "Edit node",
          editDescription: "Update routing metadata, health, and capacity.",
          deleteTitle: "Delete node",
          deleteDescription: `This removes ${node.name} and its model routes.`,
          active: "Active",
          disabled: "Disabled",
          unknown: "Unknown",
          ok: "OK",
          degraded: "Degraded",
          down: "Down",
          error: "Error",
        };

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
            {copy.edit}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{copy.editTitle}</DialogTitle>
            <DialogDescription>{copy.editDescription}</DialogDescription>
          </DialogHeader>
          <form action={editAction} className="grid gap-4">
            <input type="hidden" name="node_id" value={node.id} />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor={`node-name-${node.id}`}>Name</Label>
                <Input id={`node-name-${node.id}`} name="name" defaultValue={node.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-base-${node.id}`}>Base URL</Label>
                <Input id={`node-base-${node.id}`} name="base_url" defaultValue={node.base_url} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-region-${node.id}`}>Region</Label>
                <Input id={`node-region-${node.id}`} name="region" defaultValue={node.region} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-auth-${node.id}`}>Auth type</Label>
                <Input id={`node-auth-${node.id}`} name="auth_type" defaultValue={node.auth_type} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-status-${node.id}`}>Status</Label>
                <select
                  id={`node-status-${node.id}`}
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
                <Label htmlFor={`node-health-${node.id}`}>Health</Label>
                <select
                  id={`node-health-${node.id}`}
                  name="health_status"
                  value={healthStatus}
                  onChange={(event) => setHealthStatus(event.target.value)}
                  className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
                >
                  <option value="unknown">{copy.unknown}</option>
                  <option value="ok">{copy.ok}</option>
                  <option value="degraded">{copy.degraded}</option>
                  <option value="down">{copy.down}</option>
                  <option value="error">{copy.error}</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-weight-${node.id}`}>Weight</Label>
                <Input id={`node-weight-${node.id}`} name="weight" type="number" defaultValue={node.weight} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`node-concurrency-${node.id}`}>Max concurrency</Label>
                <Input id={`node-concurrency-${node.id}`} name="max_concurrency" type="number" defaultValue={node.max_concurrency} />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor={`node-tags-${node.id}`}>Tags</Label>
                <Input id={`node-tags-${node.id}`} name="tags" defaultValue={node.tags.join(", ")} />
              </div>
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
            <input type="hidden" name="node_id" value={node.id} />
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
