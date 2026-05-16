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
import type { WalletPageCopy } from "@/lib/wallet-page-copy-types";

const idleState: ConsoleActionState = { status: "idle" };

export function AdminWalletChannelActions({ channel, copy }: { channel: PaymentChannel; copy: WalletPageCopy["forms"] }) {
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
            {copy.edit}
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{copy.channelEditTitle}</DialogTitle>
            <DialogDescription>{copy.channelEditDescription}</DialogDescription>
          </DialogHeader>
          <form action={editAction} className="grid gap-4">
            <input type="hidden" name="channel_id" value={channel.id} />
            <div className="grid gap-3 md:grid-cols-2">
              <InputField name="name" defaultValue={channel.name} />
              <InputField name="provider" defaultValue={channel.provider} />
              <InputField name="channel_code" defaultValue={channel.channel_code} />
              <InputField name="sort_order" defaultValue={String(channel.sort_order)} />
              <SelectField name="status" defaultValue={channel.status} copy={copy} />
              <label className="flex items-center gap-2 rounded-[12px] border border-outline-variant/20 px-4 py-3 text-[0.88rem] text-on-surface">
                <input type="checkbox" name="is_recommended" defaultChecked={channel.is_recommended} />
                {copy.newChannelRecommended}
              </label>
            </div>
            <InputField name="description" defaultValue={channel.description ?? ""} className="md:col-span-2" />
            <FormStatus status={editState.status} message={editState.message} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
                {copy.cancel}
              </Button>
              <Button type="submit" disabled={editPending}>
                {editPending ? copy.saving : copy.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <button type="button" className="text-[0.78rem] font-medium text-error">
            {copy.remove}
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.channelDeleteTitle}</DialogTitle>
            <DialogDescription>{copy.channelDeleteDescription(channel.name)}</DialogDescription>
          </DialogHeader>
          <form action={deleteAction} className="grid gap-4">
            <input type="hidden" name="channel_id" value={channel.id} />
            <FormStatus status={deleteState.status} message={deleteState.message} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)}>
                {copy.cancel}
              </Button>
              <Button type="submit" disabled={deletePending}>
                {deletePending ? copy.deleting : copy.confirmDelete}
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

function SelectField({
  name,
  defaultValue,
  copy,
}: {
  name: string;
  defaultValue: string;
  copy: WalletPageCopy["forms"];
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="h-11 rounded-[12px] border border-outline-variant/20 bg-surface px-4 text-[0.88rem] text-on-surface dark:bg-surface-container-low"
    >
      <option value="active">{copy.statusActive}</option>
      <option value="disabled">{copy.statusDisabled}</option>
    </select>
  );
}
