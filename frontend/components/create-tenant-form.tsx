"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  createTenantAction,
} from "@/lib/admin-actions";
import type { AdminActionState } from "@/lib/admin-actions";
import type { DashboardDictionary } from "@/lib/i18n";
import { FormStatus } from "@/components/form-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function CreateTenantForm({
  form,
  common,
  labels,
  statusLabels,
}: {
  form: DashboardDictionary["forms"]["tenants"];
  common: DashboardDictionary["forms"]["common"];
  labels: Pick<
    DashboardDictionary["labels"],
    "name" | "status" | "quota" | "rpm" | "tpm"
  >;
  statusLabels: Pick<DashboardDictionary["status"], "active" | "paused">;
}) {
  const initialAdminActionState: AdminActionState = { status: "idle" };
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createTenantAction,
    initialAdminActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <Card className="glass-panel">
      <CardHeader className="border-b border-black/5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
          {form.eyebrow}
        </p>
        <CardTitle className="editorial-title text-3xl leading-none text-black">
          {form.title}
        </CardTitle>
        <CardDescription>{form.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 p-6">
        <form ref={formRef} action={action} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="tenant-name">{labels.name}</Label>
              <Input id="tenant-name" name="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tenant-status">{labels.status}</Label>
              <Select id="tenant-status" name="status" defaultValue="active">
                <option value="active">{statusLabels.active}</option>
                <option value="paused">{statusLabels.paused}</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tenant-balance">{labels.quota}</Label>
              <Input
                id="tenant-balance"
                name="quota_balance"
                type="number"
                step="0.01"
                defaultValue="0"
              />
            </div>
            <div className="grid gap-2 md:grid-cols-2 md:gap-5">
              <div className="grid gap-2">
                <Label htmlFor="tenant-rpm">{labels.rpm}</Label>
                <Input
                  id="tenant-rpm"
                  name="rate_limit_rpm"
                  type="number"
                  defaultValue="60"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-tpm">{labels.tpm}</Label>
                <Input
                  id="tenant-tpm"
                  name="rate_limit_tpm"
                  type="number"
                  defaultValue="120000"
                />
              </div>
            </div>
          </div>

          <FormStatus
            status={state.status}
            message={
              state.message
                ? state.status === "success"
                  ? form.messages.success
                  : state.message
                : undefined
            }
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? common.submitting : form.submit}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
