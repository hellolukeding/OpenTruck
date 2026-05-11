"use client";

import { useActionState, useEffect, useRef } from "react";

import type { Node } from "@/lib/admin-api";
import {
  createNodeModelAction,
} from "@/lib/admin-actions";
import type { AdminActionState } from "@/lib/admin-actions";
import type { DashboardDictionary } from "@/lib/i18n";
import { FormStatus } from "@/components/form-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function CreateNodeModelForm({
  form,
  common,
  labels,
  statusLabels,
  nodes,
}: {
  form: DashboardDictionary["forms"]["models"];
  common: DashboardDictionary["forms"]["common"];
  labels: Pick<
    DashboardDictionary["labels"],
    | "node"
    | "publicModel"
    | "externalModel"
    | "input"
    | "output"
    | "priority"
    | "status"
  >;
  statusLabels: Pick<DashboardDictionary["status"], "active" | "paused">;
  nodes: Node[];
}) {
  const initialAdminActionState: AdminActionState = { status: "idle" };
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createNodeModelAction,
    initialAdminActionState,
  );

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
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="grid gap-2 md:col-span-2 xl:col-span-1">
              <Label htmlFor="node-model-node">{labels.node}</Label>
              <Select id="node-model-node" name="node_id" required defaultValue="">
                <option value="" disabled>
                  {form.selectNode}
                </option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-model-public">{labels.publicModel}</Label>
              <Input id="node-model-public" name="public_model" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-model-external">{labels.externalModel}</Label>
              <Input id="node-model-external" name="external_model" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-model-input">{labels.input}</Label>
              <Input
                id="node-model-input"
                name="input_price"
                type="number"
                step="0.000001"
                defaultValue="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-model-output">{labels.output}</Label>
              <Input
                id="node-model-output"
                name="output_price"
                type="number"
                step="0.000001"
                defaultValue="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-model-priority">{labels.priority}</Label>
              <Input
                id="node-model-priority"
                name="priority"
                type="number"
                defaultValue="100"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-model-status">{labels.status}</Label>
              <Select id="node-model-status" name="status" defaultValue="active">
                <option value="active">{statusLabels.active}</option>
                <option value="paused">{statusLabels.paused}</option>
              </Select>
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
            <Button type="submit" disabled={pending || nodes.length === 0}>
              {pending ? common.submitting : form.submit}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
