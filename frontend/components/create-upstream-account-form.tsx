"use client";

import { useEffect, useState } from "react";
import type { Tenant } from "@/lib/admin-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateUpstreamAccountOAuthStart } from "@/components/create-upstream-account-oauth-start";
import { CreateUpstreamAccountOAuthComplete } from "@/components/create-upstream-account-oauth-complete";

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
        };

  const [tenantId, setTenantId] = useState(tenants[0]?.id ?? "");
  const [accountStatus, setAccountStatus] = useState("active");

  const handleGenerateSuccess = (nextTenantId: string) => {
    if (nextTenantId) {
      setTenantId(nextTenantId);
    }
  };

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
            <CreateUpstreamAccountOAuthStart
              locale={locale}
              tenants={tenants}
              tenantId={tenantId}
              onTenantIdChange={setTenantId}
              onGenerateSuccess={handleGenerateSuccess}
            />
          </TabsContent>

          <TabsContent value="complete">
            <CreateUpstreamAccountOAuthComplete
              locale={locale}
              tenants={tenants}
              tenantId={tenantId}
              onTenantIdChange={setTenantId}
              accountStatus={accountStatus}
              onAccountStatusChange={setAccountStatus}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
