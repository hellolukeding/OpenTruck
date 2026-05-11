import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { ResourceStatusBadge, ResourceTableCard } from "@/components/resource-table-card";
import { getAdminOverview } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

export default async function ModelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dictionary = getDictionary(typedLocale);
  const overview = await getAdminOverview();

  return (
    <AdminShell
      locale={typedLocale}
      currentPath={`/${typedLocale}/models`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <ResourceTableCard
        eyebrow={dictionary.resources.models.eyebrow}
        title={dictionary.resources.models.title}
        description={dictionary.resources.models.description}
        emptyLabel={dictionary.resources.models.empty}
        noteTitle={dictionary.resources.models.noteTitle}
        noteBody={dictionary.resources.models.noteBody}
        summary={[
          {
            label: dictionary.resources.models.summary.count,
            value: overview.nodeModels.length,
            note: dictionary.resources.models.summary.countNote,
          },
          {
            label: dictionary.resources.models.summary.publicModels,
            value: new Set(overview.nodeModels.map((model) => model.public_model)).size,
            note: dictionary.resources.models.summary.publicModelsNote,
          },
          {
            label: dictionary.resources.models.summary.active,
            value: overview.nodeModels.filter((model) => model.status === "active").length,
            note: dictionary.resources.models.summary.activeNote,
          },
        ]}
        items={overview.nodeModels}
        columns={[
          {
            key: "publicModel",
            label: dictionary.labels.publicModel,
            render: (model) => (
              <span className="font-medium text-black">{model.public_model}</span>
            ),
          },
          {
            key: "externalModel",
            label: dictionary.labels.externalModel,
            render: (model) => model.external_model,
          },
          {
            key: "priority",
            label: dictionary.labels.priority,
            render: (model) => model.priority,
          },
          {
            key: "status",
            label: dictionary.labels.status,
            render: (model) => <ResourceStatusBadge status={model.status} />,
          },
          {
            key: "pricing",
            label: dictionary.labels.pricing,
            render: (model) => `${model.input_price} / ${model.output_price}`,
          },
        ]}
      />
    </AdminShell>
  );
}
