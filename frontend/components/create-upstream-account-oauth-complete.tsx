"use client";

import { useActionState, useEffect, useRef } from "react";
import type { Tenant } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import { createUpstreamAccountFromOAuthAction } from "@/lib/admin-actions";
import { FormStatus } from "@/components/form-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { UpstreamAccountsPageCopy } from "@/lib/upstream-accounts-page-copy";

const idleState: AdminActionState = { status: "idle" };

interface CreateUpstreamAccountOAuthCompleteProps {
  locale: "en" | "zh-CN";
  copy: UpstreamAccountsPageCopy["intake"]["complete"];
  tenants: Tenant[];
  tenantId: string;
  onTenantIdChange: (id: string) => void;
  accountStatus: string;
  onAccountStatusChange: (status: string) => void;
}

export function CreateUpstreamAccountOAuthComplete({
  locale,
  copy,
  tenants,
  tenantId,
  onTenantIdChange,
  accountStatus,
  onAccountStatusChange,
}: CreateUpstreamAccountOAuthCompleteProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [completeState, completeAction, completePending] = useActionState(
    createUpstreamAccountFromOAuthAction,
    idleState,
  );

  useEffect(() => {
    if (completeState.status === "success") {
      formRef.current?.reset();
      onAccountStatusChange("active");
    }
  }, [completeState.status, onAccountStatusChange]);

  return (
    <form ref={formRef} action={completeAction} className="grid gap-5">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="oauth-complete-tenant">{copy.labels.tenant}</Label>
          <Select value={tenantId} onValueChange={onTenantIdChange}>
            <SelectTrigger id="oauth-complete-tenant">
              <SelectValue placeholder={copy.labels.selectTenant} />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="tenant_id" value={tenantId} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="oauth-complete-name">{copy.labels.name}</Label>
          <Input id="oauth-complete-name" name="name" placeholder="Codex Team Account" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="oauth-complete-session">{copy.labels.sessionId}</Label>
          <Input id="oauth-complete-session" name="session_id" placeholder="session UUID" required />
          <p className="font-code-sm text-code-sm text-on-surface-variant">
            {copy.hints.sessionId}
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="oauth-complete-state">{copy.labels.state}</Label>
          <Input id="oauth-complete-state" name="state" placeholder="OAuth state" required />
          <p className="font-code-sm text-code-sm text-on-surface-variant">
            {copy.hints.state}
          </p>
        </div>
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="oauth-complete-code">{copy.labels.code}</Label>
          <Textarea id="oauth-complete-code" name="code" rows={5} required />
          <p className="font-code-sm text-code-sm text-on-surface-variant">
            {copy.hints.code}
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="oauth-complete-status">{copy.labels.status}</Label>
          <Select value={accountStatus} onValueChange={onAccountStatusChange}>
            <SelectTrigger id="oauth-complete-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{copy.status.active}</SelectItem>
              <SelectItem value="disabled">{copy.status.disabled}</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="status" value={accountStatus} />
        </div>
      </div>

      <FormStatus
        status={completeState.status}
        message={
          completeState.message
            ? completeState.status === "success"
              ? copy.messages.created
              : completeState.message
            : undefined
        }
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={completePending || !tenantId}>
          {completePending ? "..." : copy.actions.create}
        </Button>
      </div>
    </form>
  );
}
