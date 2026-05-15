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
import type { PaymentPlan } from "@/lib/admin-console-api";
import {
  deletePaymentPlanAction,
  type ConsoleActionState,
  updatePaymentPlanAction,
} from "@/lib/admin-console-actions";

const idleState: ConsoleActionState = { status: "idle" };

export function AdminWalletPlanActions({ plan }: { plan: PaymentPlan }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editState, editAction, editPending] = useActionState(updatePaymentPlanAction, idleState);
  const [deleteState, deleteAction, deletePending] = useActionState(deletePaymentPlanAction, idleState);

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
            <DialogTitle>编辑套餐</DialogTitle>
            <DialogDescription>调整价格、额度、排序与展示标签。</DialogDescription>
          </DialogHeader>
          <form action={editAction} className="grid gap-4">
            <input type="hidden" name="plan_id" value={plan.id} />
            <div className="grid gap-3 md:grid-cols-2">
              <InputField name="name" defaultValue={plan.name} />
              <InputField name="badge_text" defaultValue={plan.badge_text ?? ""} />
              <InputField name="price_amount" defaultValue={plan.price_amount} />
              <InputField name="credit_amount" defaultValue={plan.credit_amount} />
              <InputField name="quota_units" defaultValue={String(plan.quota_units)} />
              <InputField name="sort_order" defaultValue={String(plan.sort_order)} />
              <SelectField name="status" defaultValue={plan.status} />
              <label className="flex items-center gap-2 rounded-[12px] border border-outline-variant/20 px-4 py-3 text-[0.88rem] text-on-surface">
                <input type="checkbox" name="is_featured" defaultChecked={plan.is_featured} />
                设为推荐套餐
              </label>
            </div>
            <InputField name="description" defaultValue={plan.description ?? ""} className="md:col-span-2" />
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
            <DialogTitle>删除套餐</DialogTitle>
            <DialogDescription>删除后将移除套餐 “{plan.name}” 的控制台展示。</DialogDescription>
          </DialogHeader>
          <form action={deleteAction} className="grid gap-4">
            <input type="hidden" name="plan_id" value={plan.id} />
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
