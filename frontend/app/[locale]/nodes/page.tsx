import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { CreateNodeForm } from "@/components/create-node-form";
import { NodeRowActions } from "@/components/node-row-actions";
import { PaginationControls } from "@/components/pagination-controls";
import { ResourceFilters } from "@/components/resource-filters";
import { ResourceStatusBadge, ResourceTableCard } from "@/components/resource-table-card";
import { getAdminOverview, getNodesPage } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

export default async function NodesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dictionary = getDictionary(typedLocale);
  const overview = await getAdminOverview();
  const page = Number(query.page ?? "1");
  const status = query.status?.trim() || undefined;
  const search = query.search?.trim() || undefined;
  const nodePage = await getNodesPage({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 10,
    status,
    search,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  return (
    <AdminShell
      locale={typedLocale}
      currentPath={`/${typedLocale}/nodes`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <CreateNodeForm
        locale={typedLocale}
        form={dictionary.forms.nodes}
        common={dictionary.forms.common}
        labels={{
          name: dictionary.labels.name,
          baseUrl: dictionary.labels.baseUrl,
          region: dictionary.labels.region,
          status: dictionary.labels.status,
          health: dictionary.labels.health,
          authType: dictionary.labels.authType,
          weight: dictionary.labels.weight,
          concurrency: dictionary.labels.concurrency,
          tags: dictionary.labels.tags,
        }}
        statusLabels={dictionary.status}
      />
      <ResourceFilters
        locale={typedLocale}
        path={`/${typedLocale}/nodes`}
        search={search}
        status={status}
        statusOptions={[
          { value: "active", label: dictionary.status.active },
          { value: "disabled", label: dictionary.status.disabled },
        ]}
      />
      <ResourceTableCard
        eyebrow={dictionary.resources.nodes.eyebrow}
        title={dictionary.resources.nodes.title}
        description={dictionary.resources.nodes.description}
        emptyLabel={dictionary.resources.nodes.empty}
        noteTitle={dictionary.resources.nodes.noteTitle}
        noteBody={dictionary.resources.nodes.noteBody}
        summary={[
          {
            label: dictionary.resources.nodes.summary.count,
            value: nodePage.pagination.total,
            note: dictionary.resources.nodes.summary.countNote,
          },
          {
            label: dictionary.resources.nodes.summary.healthy,
            value: nodePage.items.filter((node) => node.health_status === "ok").length,
            note: dictionary.resources.nodes.summary.healthyNote,
          },
          {
            label: dictionary.resources.nodes.summary.capacity,
            value: nodePage.items.reduce((sum, node) => sum + node.max_concurrency, 0),
            note: dictionary.resources.nodes.summary.capacityNote,
          },
        ]}
        items={nodePage.items}
        columns={[
          {
            key: "name",
            label: dictionary.labels.name,
            render: (node) => <span className="font-medium text-black">{node.name}</span>,
          },
          {
            key: "status",
            label: dictionary.labels.status,
            render: (node) => <ResourceStatusBadge status={node.health_status} />,
          },
          {
            key: "region",
            label: dictionary.labels.region,
            render: (node) => node.region,
          },
          {
            key: "weight",
            label: dictionary.labels.weight,
            render: (node) => node.weight,
          },
          {
            key: "concurrency",
            label: dictionary.labels.concurrency,
            render: (node) => node.max_concurrency,
          },
          {
            key: "actions",
            label: "",
            render: (node) => <NodeRowActions locale={typedLocale} node={node} />,
          },
        ]}
      />
      <PaginationControls
        locale={typedLocale}
        path={`/${typedLocale}/nodes`}
        pagination={nodePage.pagination}
        query={{ search, status }}
      />
    </AdminShell>
  );
}
