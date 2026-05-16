import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { CreateNodeModelForm } from "@/components/create-node-model-form";
import { NodeModelRowActions } from "@/components/node-model-row-actions";
import { PaginationControls } from "@/components/pagination-controls";
import { ResourceFilters } from "@/components/resource-filters";
import { ResourceStatusBadge } from "@/components/resource-table-card";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminOverview, getNodeModelsPage, getNodesPage } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

export default async function ModelsPage({
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
  const nodeOptions = await getNodesPage({ page: 1, pageSize: 100, sortBy: "name", sortOrder: "asc" });
  const page = Number(query.page ?? "1");
  const status = query.status?.trim() || undefined;
  const search = query.search?.trim() || undefined;
  const modelPage = await getNodeModelsPage({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 8,
    status,
    search,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  return (
    <AdminShell
      locale={typedLocale}
      currentPath={`/${typedLocale}/models`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <CreateNodeModelForm
        locale={typedLocale}
        form={dictionary.forms.models}
        common={dictionary.forms.common}
        labels={{
          node: dictionary.labels.node,
          publicModel: dictionary.labels.publicModel,
          externalModel: dictionary.labels.externalModel,
          input: dictionary.labels.input,
          output: dictionary.labels.output,
          priority: dictionary.labels.priority,
          status: dictionary.labels.status,
        }}
        statusLabels={dictionary.status}
        nodes={nodeOptions.items}
      />

      {/* Header */}
      <div className="flex flex-col gap-lg">
        <div className="flex flex-col gap-sm">
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            {dictionary.resources.models.title}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            {dictionary.resources.models.description}
          </p>
        </div>
      </div>

      <ResourceFilters
        locale={typedLocale}
        path={`/${typedLocale}/models`}
        search={search}
        status={status}
        statusOptions={[
          { value: "active", label: dictionary.status.active },
          { value: "disabled", label: dictionary.status.disabled },
        ]}
      />

      {/* Models Grid */}
      {modelPage.items.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {modelPage.items.map((model) => (
            <div
              key={model.id}
              className="bg-surface-container-lowest border border-outline-variant p-lg flex flex-col gap-md hover:bg-surface-container-low transition-colors rounded-xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 bg-surface-container border border-outline-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>
                      neurology
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary">
                      {model.public_model}
                    </h3>
                    <p className="font-code-sm text-code-sm text-on-surface-variant">
                      via {model.external_model}
                    </p>
                  </div>
                </div>
                <ResourceStatusBadge status={model.status} />
              </div>

              {/* Pricing Block */}
              <div className="border border-outline-variant p-md bg-surface mt-auto">
                <div className="grid grid-cols-2 gap-md mb-md">
                  <div>
                    <p className="font-code-sm text-code-sm text-on-surface-variant">Input / 1K</p>
                    <p className="font-label-md text-label-md text-primary">{model.input_price}</p>
                  </div>
                  <div>
                    <p className="font-code-sm text-code-sm text-on-surface-variant">Output / 1K</p>
                    <p className="font-label-md text-label-md text-primary">{model.output_price}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-sm border-t border-outline-variant">
                  <span className="font-code-sm text-code-sm text-on-surface-variant">
                    Priority {model.priority}
                  </span>
                  <NodeModelRowActions locale={typedLocale} nodeModel={model} />
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <Card>
          <CardContent className="p-lg text-center">
            <p className="font-body-md text-body-md text-on-surface-variant py-xl">
              {dictionary.resources.models.empty}
            </p>
          </CardContent>
        </Card>
      )}
      <PaginationControls
        locale={typedLocale}
        path={`/${typedLocale}/models`}
        pagination={modelPage.pagination}
        query={{ search, status }}
      />
    </AdminShell>
  );
}
