import Link from "next/link";
import { Globe, KeyRound, RadioTower, Route, Users } from "lucide-react";

import type { ApiKey, Node, NodeModel, Tenant } from "@/lib/admin-api";
import type { DashboardDictionary, Locale } from "@/lib/i18n";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AdminDashboardProps = {
  tenants: Tenant[];
  nodes: Node[];
  apiKeys: ApiKey[];
  nodeModels: NodeModel[];
  backendReachable: boolean;
  backendUrl: string;
  locale: Locale;
  dictionary: DashboardDictionary;
};

function formatDate(value: string | null, fallback: string): string {
  if (!value) return fallback;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusVariant(status: string): "default" | "secondary" | "success" | "warning" {
  const normalized = status.toLowerCase();
  if (normalized === "active" || normalized === "ok") return "success";
  if (normalized === "unknown" || normalized === "paused") return "warning";
  return "secondary";
}

function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
        {eyebrow}
      </p>
      <h2 className="editorial-title text-3xl leading-none text-black">
        {title}
      </h2>
    </div>
  );
}

export function AdminDashboard({
  tenants,
  nodes,
  apiKeys,
  nodeModels,
  backendReachable,
  backendUrl,
  locale,
  dictionary,
}: AdminDashboardProps) {
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
    <main className="dashboard-shell">
      <div className="dashboard-grid">
        <section className="grid gap-6 lg:grid-cols-[1.65fr_0.85fr]">
          <Card className="glass-panel overflow-hidden">
            <CardHeader className="gap-6 border-b border-black/5 bg-white/80">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                    {dictionary.heroKicker}
                  </p>
                  <CardTitle className="editorial-title text-5xl leading-[0.92] md:text-6xl">
                    {dictionary.heroTitle}
                  </CardTitle>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white p-1">
                  <Globe className="ml-2 h-4 w-4 text-neutral-500" />
                  {SUPPORTED_LOCALES.map((item) => (
                    <Link key={item} href={`/${item}`}>
                      <Button
                        variant={locale === item ? "default" : "ghost"}
                        size="sm"
                      >
                        {dictionary.languages[item]}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
              <CardDescription className="max-w-3xl text-base leading-7 text-neutral-600">
                {dictionary.heroSummary}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-panel bg-black text-white">
            <CardHeader>
              <CardDescription className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">
                {dictionary.backendLabel}
              </CardDescription>
              <Badge variant={backendReachable ? "success" : "warning"}>
                {backendReachable
                  ? dictionary.backendOnline
                  : dictionary.backendOffline}
              </Badge>
              <p className="mono text-xs text-neutral-300">{backendUrl}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-neutral-300">
                {dictionary.backendHint}
              </p>
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

        {!backendReachable ? (
          <Card className="glass-panel border-black/20 bg-neutral-50">
            <CardContent className="p-5">
              <p className="text-base font-medium text-black">
                {dictionary.backendOffline}
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                {dictionary.backendHint}
              </p>
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-2">
          <Card className="glass-panel">
            <CardHeader className="border-b border-black/5">
              <SectionHeader
                eyebrow={dictionary.sections.tenants}
                title={dictionary.sections.tenantsTitle}
              />
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{dictionary.labels.name}</TableHead>
                    <TableHead>{dictionary.labels.status}</TableHead>
                    <TableHead>{dictionary.labels.quota}</TableHead>
                    <TableHead>{dictionary.labels.rpm}</TableHead>
                    <TableHead>{dictionary.labels.tpm}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(tenant.status)}>
                          {tenant.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{tenant.quota_balance}</TableCell>
                      <TableCell>{tenant.rate_limit_rpm}</TableCell>
                      <TableCell>{tenant.rate_limit_tpm}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="border-b border-black/5">
              <SectionHeader
                eyebrow={dictionary.sections.nodes}
                title={dictionary.sections.nodesTitle}
              />
            </CardHeader>
            <CardContent className="grid gap-4">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="rounded-2xl border border-black/10 bg-neutral-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-black">{node.name}</h3>
                      <p className="mono mt-2 text-xs text-neutral-500">
                        {node.base_url}
                      </p>
                    </div>
                    <Badge variant={statusVariant(node.health_status)}>
                      {node.health_status}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-neutral-500">
                    <span>
                      {dictionary.labels.region}: {node.region}
                    </span>
                    <span>
                      {dictionary.labels.weight}: {node.weight}
                    </span>
                    <span>
                      {dictionary.labels.concurrency}: {node.max_concurrency}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {node.tags.map((tag) => (
                      <Badge key={`${node.id}-${tag}`} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="border-b border-black/5">
              <SectionHeader
                eyebrow={dictionary.sections.keys}
                title={dictionary.sections.keysTitle}
              />
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{dictionary.labels.name}</TableHead>
                    <TableHead>{dictionary.labels.status}</TableHead>
                    <TableHead>{dictionary.labels.tenant}</TableHead>
                    <TableHead>{dictionary.labels.lastUsed}</TableHead>
                    <TableHead>{dictionary.labels.fingerprint}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium">{apiKey.name}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(apiKey.status)}>
                          {apiKey.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="mono text-xs">
                        {apiKey.tenant_id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        {formatDate(apiKey.last_used_at, dictionary.labels.never)}
                      </TableCell>
                      <TableCell className="mono text-xs">
                        {apiKey.key_hash.slice(0, 12)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="border-b border-black/5">
              <SectionHeader
                eyebrow={dictionary.sections.models}
                title={dictionary.sections.modelsTitle}
              />
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{dictionary.labels.publicModel}</TableHead>
                    <TableHead>{dictionary.labels.externalModel}</TableHead>
                    <TableHead>{dictionary.labels.status}</TableHead>
                    <TableHead>{dictionary.labels.priority}</TableHead>
                    <TableHead>{dictionary.labels.input}</TableHead>
                    <TableHead>{dictionary.labels.output}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nodeModels.map((nodeModel) => (
                    <TableRow key={nodeModel.id}>
                      <TableCell className="font-medium">
                        {nodeModel.public_model}
                      </TableCell>
                      <TableCell>{nodeModel.external_model}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(nodeModel.status)}>
                          {nodeModel.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{nodeModel.priority}</TableCell>
                      <TableCell>{nodeModel.input_price}</TableCell>
                      <TableCell>{nodeModel.output_price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
