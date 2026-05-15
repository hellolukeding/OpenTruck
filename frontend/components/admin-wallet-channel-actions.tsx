"use client";

import { useActionState, useEffect, useState } from "react";

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
import type { PaymentChannel } from "@/lib/admin-console-api";
import {
  deletePaymentChannelAction,
  type ConsoleActionState,
  updatePaymentChannelAction,
} from "@/lib/admin-console-actions";

const idleState: ConsoleActionState = { status: "idle" };

export function AdminWalletChannelActions({ channel }: { channel: PaymentChannel }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editState, editAction, editPending] = useActionState(updatePaymentChannelAction, idleState);
  const [deleteState, deleteAction, deletePending] = useActionState(deletePaymentChannelAction, idleState);

  useEffect(() => {
    if (editState.status === "success") setEditOpen(false);
  }, [editState.status]);

  useEffect(() => {
    if (deleteState.status === "success") setDeleteOpen(false);
  }, [deleteState.status]);

  return (
    <div className="flex items-center gap-2">
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <button type="button" className="text-[0.78rem] font-medium text-primary">
            编辑
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑支付渠道</DialogTitle>
            <DialogDescription>调整 provider、渠道编码、排序和推荐状态。</DialogDescription>
          </DialogHeader>
          <form action={editAction} className="grid gap-4">
            <input type="hidden" name="channel_id" value={channel.id} />
            <div className="grid gap-3 md:grid-cols-2">
              <InputField name="name" defaultValue={channel.name} />
              <InputField name="provider" defaultValue={channel.provider} />
              <InputField name="channel_code" defaultValue={channel.channel_code} />
              <InputField name="sort_order" defaultValue={String(channel.sort_order)} />
              <SelectField name="status" defaultValue={channel.status} />
              <label className="flex items-center gap-2 rounded-[12px] border border-outline-variant/20 px-4 py-3 text-[0.88rem] text-on-surface">
                <input type="checkbox" name="is_recommended" defaultChecked={channel.is_recommended} />
                设为推荐渠道
              </label>
            </div>
            <InputField name="description" defaultValue={channel.description ?? ""} className="md:col-span-2" />
            <FormStatus status={editState.status} message={editState.message} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={editPending}>
                {editPending ? "保存中..." : "保存修改"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <button type="button" className="text-[0.78rem] font-medium text-error">
            删除
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除支付渠道</DialogTitle>
            <DialogDescription>删除后将移除渠道 “{channel.name}” 的充值入口。</DialogDescription>
          </DialogHeader>
          <form action={deleteAction} className="grid gap-4">
            <input type="hidden" name="channel_id" value={channel.id} />
            <FormStatus status={deleteState.status} message={deleteState.message} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={deletePending}>
                {deletePending ? "删除中..." : "确认删除"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InputField({
  name,
  defaultValue,
  className,
}: {
  name: string;
  defaultValue: string;
  className?: string;
}) {
  return (
    <input
      name={name}
      defaultValue={defaultValue}
      className={`h-11 rounded-[12px] border border-outline-variant/20 bg-surface px-4 text-[0.88rem] text-on-surface dark:bg-surface-container-low ${className ?? ""}`}
    />
  );
}

function SelectField({ name, defaultValue }: { name: string; defaultValue: string }) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="h-11 rounded-[12px] border border-outline-variant/20 bg-surface px-4 text-[0.88rem] text-on-surface dark:bg-surface-container-low"
    >
      <option value="active">active</option>
      <option value="disabled">disabled</option>
    </select>
  );
}
