"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { createNodeAction } from "@/lib/admin-actions";
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

export function CreateNodeForm({
  locale,
  form,
  common,
  labels,
  statusLabels,
}: {
  locale: "en" | "zh-CN";
  form: DashboardDictionary["forms"]["nodes"];
  common: DashboardDictionary["forms"]["common"];
  labels: Pick<
    DashboardDictionary["labels"],
    | "name"
    | "baseUrl"
    | "region"
    | "status"
    | "health"
    | "authType"
    | "weight"
    | "concurrency"
    | "tags"
  >;
  statusLabels: Pick<
    DashboardDictionary["status"],
    "active" | "disabled" | "ok" | "unknown" | "degraded" | "down" | "error"
  >;
}) {
  const initialAdminActionState: AdminActionState = { status: "idle" };
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createNodeAction,
    initialAdminActionState,
  );
  const [nodeStatus, setNodeStatus] = useState("active");
  const [nodeHealth, setNodeHealth] = useState("unknown");

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <Card>
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
          <input type="hidden" name="locale" value={locale} />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="node-name">{labels.name}</Label>
              <Input id="node-name" name="name" required />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="node-base-url">{labels.baseUrl}</Label>
              <Input id="node-base-url" name="base_url" required placeholder="https://api.example.com/v1" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-region">{labels.region}</Label>
              <Input id="node-region" name="region" defaultValue="global" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-status">{labels.status}</Label>
              <Select value={nodeStatus} onValueChange={setNodeStatus}>
                <SelectTrigger id="node-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{statusLabels.active}</SelectItem>
                  <SelectItem value="disabled">{statusLabels.disabled}</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="status" value={nodeStatus} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-health">{labels.health}</Label>
              <Select value={nodeHealth} onValueChange={setNodeHealth}>
                <SelectTrigger id="node-health">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ok">{statusLabels.ok}</SelectItem>
                  <SelectItem value="unknown">{statusLabels.unknown}</SelectItem>
                  <SelectItem value="degraded">{statusLabels.degraded}</SelectItem>
                  <SelectItem value="down">{statusLabels.down}</SelectItem>
                  <SelectItem value="error">{statusLabels.error}</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="health_status" value={nodeHealth} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-auth">{labels.authType}</Label>
              <Input id="node-auth" name="auth_type" defaultValue="bearer" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-weight">{labels.weight}</Label>
              <Input id="node-weight" name="weight" type="number" defaultValue="100" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-concurrency">{labels.concurrency}</Label>
              <Input
                id="node-concurrency"
                name="max_concurrency"
                type="number"
                defaultValue="16"
              />
            </div>
            <div className="grid gap-2 md:col-span-2 xl:col-span-3">
              <Label htmlFor="node-tags">{labels.tags}</Label>
              <Input id="node-tags" name="tags" placeholder={form.tagsPlaceholder} />
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
