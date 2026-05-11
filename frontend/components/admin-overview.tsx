import { KeyRound, RadioTower, Route, Users } from "lucide-react";

import type { ApiKey, Node, NodeModel, Tenant } from "@/lib/admin-api";
import type { DashboardDictionary } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <section className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <Card className="glass-panel overflow-hidden">
          <CardHeader className="gap-4 border-b border-black/5 bg-white/80">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
              {dictionary.heroKicker}
            </p>
            <CardTitle className="editorial-title text-5xl leading-[0.94] md:text-6xl">
              {dictionary.heroTitle}
            </CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7 text-neutral-600">
              {dictionary.heroSummary}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="glass-panel bg-black text-white">
          <CardHeader>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              {dictionary.overview.signalLabel}
            </p>
            <CardTitle className="text-3xl text-white">
              {dictionary.overview.signalTitle}
            </CardTitle>
            <CardDescription className="text-neutral-300">
              {dictionary.overview.signalSummary}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-neutral-300">
            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <span>{dictionary.metrics.nodes}</span>
              <span>{nodes.filter((node) => node.status === "active").length}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <span>{dictionary.metrics.credentials}</span>
              <span>{apiKeys.filter((apiKey) => apiKey.status === "active").length}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <span>{dictionary.metrics.routes}</span>
              <span>{nodeModels.filter((model) => model.status === "active").length}</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.label} className="glass-panel">
              <CardContent className="p-5">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    {metric.label}
                  </p>
                  <Icon className="h-4 w-4 text-neutral-400" />
                </div>
                <p className="editorial-title text-5xl leading-none text-black">
                  {metric.value}
                </p>
                <p className="mt-3 text-sm text-neutral-500">{metric.note}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="glass-panel">
          <CardHeader className="border-b border-black/5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              {dictionary.overview.snapshotEyebrow}
            </p>
            <CardTitle className="editorial-title text-3xl leading-none text-black">
              {dictionary.overview.snapshotTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dictionary.labels.name}</TableHead>
                  <TableHead>{dictionary.labels.status}</TableHead>
                  <TableHead>{dictionary.labels.region}</TableHead>
                  <TableHead>{dictionary.labels.weight}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nodes.slice(0, 5).map((node) => (
                  <TableRow key={node.id}>
                    <TableCell className="font-medium text-black">{node.name}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(node.health_status)}>
                        {node.health_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{node.region}</TableCell>
                    <TableCell>{node.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="border-b border-black/5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              {dictionary.overview.ledgerEyebrow}
            </p>
            <CardTitle className="editorial-title text-3xl leading-none text-black">
              {dictionary.overview.ledgerTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {apiKeys.slice(0, 4).map((apiKey) => (
              <div
                key={apiKey.id}
                className="rounded-[1.2rem] border border-black/10 bg-neutral-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-black">{apiKey.name}</p>
                    <p className="mono mt-1 text-xs text-neutral-500">
                      {apiKey.key_hash.slice(0, 16)}...
                    </p>
                  </div>
                  <Badge variant={statusVariant(apiKey.status)}>{apiKey.status}</Badge>
                </div>
                <p className="mt-3 text-sm text-neutral-500">
                  {dictionary.labels.lastUsed}:{" "}
                  {formatDate(apiKey.last_used_at, dictionary.labels.never)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
