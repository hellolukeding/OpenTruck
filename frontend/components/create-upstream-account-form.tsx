"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import type { Tenant } from "@/lib/admin-api";
import type { AdminActionState } from "@/lib/admin-actions";
import {
  createUpstreamAccountFromOAuthAction,
  generateOpenAIOAuthUrlAction,
} from "@/lib/admin-actions";
import { FormStatus } from "@/components/form-status";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const idleState: AdminActionState = { status: "idle" };

function formatDateTime(value: string, locale: "en" | "zh-CN") {
  try {
    return new Intl.DateTimeFormat(locale === "zh-CN" ? "zh-CN" : "en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function CreateUpstreamAccountForm({
  locale,
  tenants,
}: {
  locale: "en" | "zh-CN";
  tenants: Tenant[];
}) {
  const copy =
    locale === "zh-CN"
      ? {
          eyebrow: "OAuth 接入台",
          title: "把 Codex 上游账号纳入租户账号池。",
          description:
            "先生成 OpenAI OAuth 授权链接，再在拿到 code 和 state 后完成账号落库。这个流程贴近 sub2api 的后台接入方式。",
          tabs: {
            start: "1. 生成授权链接",
            complete: "2. 完成账号接入",
          },
          labels: {
            tenant: "租户",
            redirectUri: "回调地址",
            proxyUrl: "代理地址",
            sessionId: "Session ID",
            state: "State",
            code: "授权码",
            name: "账号名称",
            status: "状态",
            authUrl: "授权链接",
            expiresAt: "过期时间",
          },
          hints: {
            redirectUri: "留空则使用后端默认回调地址",
            proxyUrl: "可选，用于需要代理访问 OpenAI OAuth 的场景",
            code: "把浏览器回调中的 code 粘贴到这里",
            state: "使用第一步生成的 state",
            sessionId: "使用第一步返回的 session_id",
          },
          actions: {
            generate: "生成授权链接",
            create: "完成接入",
            open: "打开授权链接",
          },
          status: {
            active: "活跃",
            disabled: "禁用",
          },
          messages: {
            generated: "授权链接已生成。",
            created: "上游账号已接入。",
          },
          selectTenant: "选择租户",
        }
      : {
          eyebrow: "OAuth intake",
          title: "Bring Codex upstream identities into the tenant pool.",
          description:
            "Generate an OpenAI OAuth authorization link first, then finalize the account after you have the callback code and state. This mirrors the sub2api operator flow.",
          tabs: {
            start: "1. Generate auth link",
            complete: "2. Complete account intake",
          },
          labels: {
            tenant: "Tenant",
            redirectUri: "Redirect URI",
            proxyUrl: "Proxy URL",
            sessionId: "Session ID",
            state: "State",
            code: "Authorization code",
            name: "Account name",
            status: "Status",
            authUrl: "Authorization link",
            expiresAt: "Expires at",
          },
          hints: {
            redirectUri: "Leave blank to use the backend default callback URI",
            proxyUrl: "Optional, for environments that need a proxy to reach OpenAI OAuth",
            code: "Paste the callback code from the browser here",
            state: "Use the state returned from step one",
            sessionId: "Use the session_id returned from step one",
          },
          actions: {
            generate: "Generate auth link",
            create: "Complete intake",
            open: "Open auth link",
          },
          status: {
            active: "Active",
            disabled: "Disabled",
          },
          messages: {
            generated: "Authorization link created.",
            created: "Upstream account connected.",
          },
          selectTenant: "Select a tenant",
        };

  const [tenantId, setTenantId] = useState(tenants[0]?.id ?? "");
  const [accountStatus, setAccountStatus] = useState("active");
  const generateFormRef = useRef<HTMLFormElement>(null);
  const completeFormRef = useRef<HTMLFormElement>(null);
  const [generateState, generateAction, generatePending] = useActionState(
    generateOpenAIOAuthUrlAction,
    idleState,
  );
  const [completeState, completeAction, completePending] = useActionState(
    createUpstreamAccountFromOAuthAction,
    idleState,
  );

  useEffect(() => {
    if (completeState.status === "success") {
      completeFormRef.current?.reset();
      setAccountStatus("active");
    }
  }, [completeState.status]);

  useEffect(() => {
    if (generateState.status === "success") {
      const nextTenantId = String(
        generateFormRef.current?.querySelector<HTMLInputElement>('input[name="tenant_id"]')?.value ?? "",
      );
      if (nextTenantId) {
        setTenantId(nextTenantId);
      }
    }
  }, [generateState.status]);

  return (
    <Card>
      <CardHeader>
        <p className="font-label-md text-label-md text-on-surface-variant">
          {copy.eyebrow}
        </p>
        <CardTitle className="font-headline-md text-headline-md text-primary">
          {copy.title}
        </CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 p-lg">
        <Tabs defaultValue="start" className="grid gap-4">
          <TabsList>
            <TabsTrigger value="start">{copy.tabs.start}</TabsTrigger>
            <TabsTrigger value="complete">{copy.tabs.complete}</TabsTrigger>
          </TabsList>

          <TabsContent value="start">
            <form ref={generateFormRef} action={generateAction} className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="oauth-start-tenant">{copy.labels.tenant}</Label>
                  <Select value={tenantId} onValueChange={setTenantId}>
                    <SelectTrigger id="oauth-start-tenant">
                      <SelectValue placeholder={copy.selectTenant} />
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
                      <span className="font-code-sm text-code-sm text-on-surface-variant">session_id</span>
                      <span className="font-code-sm text-code-sm text-primary break-all">
                        {generateState.details.session_id}
                      </span>
                    </div>
                    <div className="grid gap-1">
                      <span className="font-code-sm text-code-sm text-on-surface-variant">state</span>
                      <span className="font-code-sm text-code-sm text-primary break-all">
                        {generateState.details.state}
                      </span>
                    </div>
                    <div className="grid gap-1">
                      <span className="font-code-sm text-code-sm text-on-surface-variant">
                        {copy.labels.expiresAt}
                      </span>
                      <span className="font-code-sm text-code-sm text-primary">
                        {formatDateTime(generateState.details.expires_at, locale)}
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
          </TabsContent>

          <TabsContent value="complete">
            <form ref={completeFormRef} action={completeAction} className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="oauth-complete-tenant">{copy.labels.tenant}</Label>
                  <Select value={tenantId} onValueChange={setTenantId}>
                    <SelectTrigger id="oauth-complete-tenant">
                      <SelectValue placeholder={copy.selectTenant} />
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
                  <Select value={accountStatus} onValueChange={setAccountStatus}>
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
