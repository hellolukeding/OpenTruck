"use client";

import { useEffect, useState } from "react";
import type { Tenant } from "@/lib/admin-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateUpstreamAccountOAuthStart } from "@/components/create-upstream-account-oauth-start";
import { CreateUpstreamAccountOAuthComplete } from "@/components/create-upstream-account-oauth-complete";
import { getUpstreamAccountsPageCopy } from "@/lib/upstream-accounts-page-copy";

export function CreateUpstreamAccountForm({
  locale,
  tenants,
}: {
  locale: "en" | "zh-CN";
  tenants: Tenant[];
}) {
  const copy = getUpstreamAccountsPageCopy(locale).intake;

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
              copy={copy.start}
              tenants={tenants}
              tenantId={tenantId}
              onTenantIdChange={setTenantId}
              onGenerateSuccess={handleGenerateSuccess}
            />
          </TabsContent>

          <TabsContent value="complete">
            <CreateUpstreamAccountOAuthComplete
              locale={locale}
              copy={copy.complete}
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
