"use client";

import { useActionState, useEffect, useRef } from "react";

import type { Tenant } from "@/lib/admin-api";
import {
  createApiKeyAction,
} from "@/lib/admin-actions";
import type { AdminActionState } from "@/lib/admin-actions";
import type { DashboardDictionary } from "@/lib/i18n";
import { FormStatus } from "@/components/form-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function CreateApiKeyForm({
  form,
  common,
  labels,
  statusLabels,
  tenants,
}: {
  form: DashboardDictionary["forms"]["apiKeys"];
  common: DashboardDictionary["forms"]["common"];
  labels: Pick<
    DashboardDictionary["labels"],
    "tenant" | "status" | "name" | "rawKey" | "scope"
  >;
  statusLabels: Pick<DashboardDictionary["status"], "active" | "paused">;
  tenants: Tenant[];
}) {
  const initialAdminActionState: AdminActionState = { status: "idle" };
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createApiKeyAction,
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
              <Label htmlFor="api-key-tenant">{labels.tenant}</Label>
              <Select id="api-key-tenant" name="tenant_id" required defaultValue="">
                <option value="" disabled>
                  {form.selectTenant}
                </option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="api-key-status">{labels.status}</Label>
              <Select id="api-key-status" name="status" defaultValue="active">
                <option value="active">{statusLabels.active}</option>
                <option value="paused">{statusLabels.paused}</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="api-key-name">{labels.name}</Label>
              <Input id="api-key-name" name="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="api-key-raw">{labels.rawKey}</Label>
              <Input id="api-key-raw" name="raw_key" required />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="api-key-scope">{labels.scope}</Label>
              <Textarea
                id="api-key-scope"
                name="scope"
                defaultValue={"{}"}
                placeholder={form.scopePlaceholder}
              />
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
            <Button type="submit" disabled={pending || tenants.length === 0}>
              {pending ? common.submitting : form.submit}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
