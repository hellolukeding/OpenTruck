"use client";

import Link from "next/link";
import { useActionState, useRef } from "react";
import type { Tenant } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import { generateOpenAIOAuthUrlAction } from "@/lib/admin-actions";
import { formatDateTimeShort } from "@/lib/date-formatters";
import { FormStatus } from "@/components/form-status";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UpstreamAccountsPageCopy } from "@/lib/upstream-accounts-page-copy";
import { cn } from "@/lib/utils";

const idleState: AdminActionState = { status: "idle" };

interface CreateUpstreamAccountOAuthStartProps {
  locale: "en" | "zh-CN";
  copy: UpstreamAccountsPageCopy["intake"]["start"];
  tenants: Tenant[];
  tenantId: string;
  onTenantIdChange: (id: string) => void;
  onGenerateSuccess?: (tenantId: string) => void;
}

export function CreateUpstreamAccountOAuthStart({
  locale,
  copy,
  tenants,
  tenantId,
  onTenantIdChange,
  onGenerateSuccess,
}: CreateUpstreamAccountOAuthStartProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [generateState, generateAction, generatePending] = useActionState(
    generateOpenAIOAuthUrlAction,
    idleState,
  );

  // 通知父组件生成成功
  if (generateState.status === "success" && onGenerateSuccess) {
    const nextTenantId = String(
      formRef.current?.querySelector<HTMLInputElement>('input[name="tenant_id"]')?.value ?? "",
    );
    if (nextTenantId) {
      onGenerateSuccess(nextTenantId);
    }
  }

  return (
    <form ref={formRef} action={generateAction} className="grid gap-5">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="oauth-start-tenant">{copy.labels.tenant}</Label>
          <Select value={tenantId} onValueChange={onTenantIdChange}>
            <SelectTrigger id="oauth-start-tenant">
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
          <Label htmlFor="oauth-start-redirect">{copy.labels.redirectUri}</Label>
          <Input id="oauth-start-redirect" name="redirect_uri" placeholder="http://localhost:1455/auth/callback" />
          <p className="font-code-sm text-code-sm text-on-surface-variant">
            {copy.hints.redirectUri}
          </p>
        </div>
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="oauth-start-proxy">{copy.labels.proxyUrl}</Label>
          <Input id="oauth-start-proxy" name="proxy_url" placeholder="http://127.0.0.1:7890" />
          <p className="font-code-sm text-code-sm text-on-surface-variant">
            {copy.hints.proxyUrl}
          </p>
        </div>
      </div>

      <FormStatus
        status={generateState.status}
        message={
          generateState.message
            ? generateState.status === "success"
              ? copy.messages.generated
              : generateState.message
            : undefined
        }
      />

      {generateState.status === "success" && generateState.details ? (
        <div className="grid gap-3 rounded-2xl border border-outline-variant bg-surface-container-low p-md">
          <div className="grid gap-1">
            <span className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-wide">
              {copy.labels.authUrl}
            </span>
            <Link
              href={generateState.details.auth_url}
              target="_blank"
              rel="noreferrer"
              className="break-all font-body-md text-body-md text-primary underline underline-offset-4"
            >
              {generateState.details.auth_url}
            </Link>
          </div>
          <div className="grid gap-1 md:grid-cols-3">
            <div className="grid gap-1">
              <span className="font-code-sm text-code-sm text-on-surface-variant">{copy.labels.sessionId}</span>
              <span className="font-code-sm text-code-sm text-primary break-all">
                {generateState.details.session_id}
              </span>
            </div>
            <div className="grid gap-1">
              <span className="font-code-sm text-code-sm text-on-surface-variant">{copy.labels.state}</span>
              <span className="font-code-sm text-code-sm text-primary break-all">
                {generateState.details.state}
              </span>
            </div>
            <div className="grid gap-1">
              <span className="font-code-sm text-code-sm text-on-surface-variant">
                {copy.labels.expiresAt}
              </span>
              <span className="font-code-sm text-code-sm text-primary">
                {formatDateTimeShort(generateState.details.expires_at, locale)}
              </span>
            </div>
          </div>
          <div>
            <Link
              href={generateState.details.auth_url}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              {copy.actions.open}
            </Link>
          </div>
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={generatePending || !tenantId}>
          {generatePending ? "..." : copy.actions.generate}
        </Button>
      </div>
    </form>
  );
}
