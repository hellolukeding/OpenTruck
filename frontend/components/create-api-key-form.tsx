"use client";

import { useActionState, useEffect, useRef, useState } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  statusLabels: Pick<DashboardDictionary["status"], "active" | "disabled">;
  tenants: Tenant[];
}) {
  const initialAdminActionState: AdminActionState = { status: "idle" };
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createApiKeyAction,
    initialAdminActionState,
  );
  const [apiKeyTenant, setApiKeyTenant] = useState("");
  const [apiKeyStatus, setApiKeyStatus] = useState("active");

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <Card id="new-api-key">
      <CardHeader>
        <p className="font-label-md text-label-md text-on-surface-variant">
          {form.eyebrow}
        </p>
        <CardTitle className="font-headline-md text-headline-md text-primary">
          {form.title}
        </CardTitle>
        <CardDescription>{form.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 p-lg">
        <form ref={formRef} action={action} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="api-key-tenant">{labels.tenant}</Label>
              <Select value={apiKeyTenant} onValueChange={setApiKeyTenant}>
                <SelectTrigger id="api-key-tenant">
                  <SelectValue placeholder={form.selectTenant} />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="tenant_id" value={apiKeyTenant} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="api-key-status">{labels.status}</Label>
              <Select value={apiKeyStatus} onValueChange={setApiKeyStatus}>
                <SelectTrigger id="api-key-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{statusLabels.active}</SelectItem>
                  <SelectItem value="disabled">{statusLabels.disabled}</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="status" value={apiKeyStatus} />
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
