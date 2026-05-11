import { KeyRound, RadioTower, Route, Users } from "lucide-react";

import type { ApiKey, Node, NodeModel, Tenant } from "@/lib/admin-api";
import type { DashboardDictionary } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type AdminOverviewProps = {
  tenants: Tenant[];
  nodes: Node[];
  apiKeys: ApiKey[];
  nodeModels: NodeModel[];
  dictionary: DashboardDictionary;
};

function statusVariant(status: string): "default" | "secondary" | "success" | "warning" {
  const normalized = status.toLowerCase();
  if (normalized === "active" || normalized === "ok") return "success";
  if (normalized === "unknown" || normalized === "paused") return "warning";
  return "secondary";
}

function formatDate(value: string | null, fallback: string): string {
  if (!value) return fallback;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AdminOverview({
  tenants,
  nodes,
  apiKeys,
  nodeModels,
  dictionary,
}: AdminOverviewProps) {
  const metrics = [
    {
      icon: Users,
      label: dictionary.metrics.tenants,
      value: tenants.length,
      note: dictionary.metrics.issuedKeys(apiKeys.length),
    },
    {
      icon: RadioTower,
      label: dictionary.metrics.nodes,
      value: nodes.length,
      note: dictionary.metrics.healthyNodes(
        nodes.filter((node) => node.health_status === "ok").length,
      ),
    },
    {
      icon: Route,
      label: dictionary.metrics.routes,
      value: new Set(nodeModels.map((model) => model.public_model)).size,
      note: dictionary.metrics.totalMappings(nodeModels.length),
    },
    {
      icon: KeyRound,
      label: dictionary.metrics.credentials,
      value: apiKeys.filter((apiKey) => apiKey.status === "active").length,
      note: dictionary.metrics.totalKeys(apiKeys.length),
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-sm">
        <h1 className="font-headline-lg text-headline-lg text-primary">
          {dictionary.overview.signalTitle}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {dictionary.overview.signalSummary}
        </p>
      </div>

      {/* Stats Grid */}
      <section className="grid gap-md grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardContent className="p-lg flex flex-col gap-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant">
                    {metric.label}
                  </span>
                  <Icon className="h-4 w-4 text-outline" />
                </div>
                <span className="font-headline-lg text-headline-lg text-primary">
                  {metric.value}
                </span>
                <span className="font-code-sm text-code-sm text-on-surface-variant">
                  {metric.note}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Bottom Sections */}
      <section className="grid gap-lg xl:grid-cols-[1.1fr_0.9fr]">
        {/* Nodes Table */}
        <Card>
          <div className="p-md border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between">
            <h3 className="font-label-md text-label-md text-primary">
              {dictionary.overview.snapshotEyebrow || "Node Snapshot"}
            </h3>
            <span className="font-code-sm text-code-sm text-on-surface-variant">
              {dictionary.overview.snapshotTitle}
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dictionary.labels.name}</TableHead>
                <TableHead>{dictionary.labels.health}</TableHead>
                <TableHead>{dictionary.labels.region}</TableHead>
                <TableHead>{dictionary.labels.weight}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.slice(0, 5).map((node) => (
                <TableRow key={node.id}>
                  <TableCell className="font-medium text-primary">{node.name}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(node.health_status)}>
                      {node.health_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{node.region}</TableCell>
                  <TableCell>{node.weight}</TableCell>
                </TableRow>
              ))}
              {nodes.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center font-body-md text-body-md text-on-surface-variant py-xl"
                  >
                    No nodes configured.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* API Keys Summary */}
        <Card>
          <div className="p-md border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between">
            <h3 className="font-label-md text-label-md text-primary">
              {dictionary.overview.ledgerEyebrow || "Credential Ledger"}
            </h3>
            <span className="font-code-sm text-code-sm text-on-surface-variant">
              {dictionary.overview.ledgerTitle}
            </span>
          </div>
          <div className="p-md flex flex-col gap-md">
            {apiKeys.slice(0, 5).map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between border-b border-outline-variant pb-md last:border-0 last:pb-0"
              >
                <div className="flex flex-col gap-xs">
                  <span className="font-label-md text-label-md text-primary">{apiKey.name}</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">
                    {apiKey.key_hash.slice(0, 16)}...
                  </span>
                </div>
                <div className="flex items-center gap-sm">
                  <span className="font-code-sm text-code-sm text-on-surface-variant">
                    {formatDate(apiKey.last_used_at, dictionary.labels.never)}
                  </span>
                  <Badge variant={statusVariant(apiKey.status)}>{apiKey.status}</Badge>
                </div>
              </div>
            ))}
            {apiKeys.length === 0 && (
              <p className="font-body-md text-body-md text-on-surface-variant text-center py-lg">
                No API keys issued.
              </p>
            )}
          </div>
        </Card>
      </section>
    </>
  );
}
