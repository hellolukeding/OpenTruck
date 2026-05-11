import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { ResourceStatusBadge } from "@/components/resource-table-card";
import { Card, CardContent } from "@/components/ui/card";
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

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-sm">
          <button className="bg-primary text-on-primary border border-primary px-md py-1 text-code-sm font-code-sm transition-colors">
            All Models
          </button>
          <button className="bg-surface text-on-surface border border-outline-variant px-md py-1 text-code-sm font-code-sm hover:bg-surface-container transition-colors">
            LLM
          </button>
          <button className="bg-surface text-on-surface border border-outline-variant px-md py-1 text-code-sm font-code-sm hover:bg-surface-container transition-colors">
            Image
          </button>
          <button className="bg-surface text-on-surface border border-outline-variant px-md py-1 text-code-sm font-code-sm hover:bg-surface-container transition-colors">
            Audio
          </button>
          <button className="bg-surface text-on-surface border border-outline-variant px-md py-1 text-code-sm font-code-sm hover:bg-surface-container transition-colors">
            Embedding
          </button>
        </div>
      </div>

      {/* Models Grid */}
      {overview.nodeModels.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {overview.nodeModels.map((model) => (
            <div
              key={model.id}
              className="bg-surface-container-lowest border border-outline-variant p-lg flex flex-col gap-md hover:bg-surface-container-low transition-colors"
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
                </div>
              </div>
            </div>
          ))}

          {/* Add Route CTA Card */}
          <div className="bg-surface border border-outline-variant border-dashed p-lg flex flex-col items-center justify-center gap-md hover:bg-surface-container-low transition-colors min-h-[280px]">
            <div className="w-12 h-12 bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: "24px" }}>
                add
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary">
              {dictionary.forms.models.title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-[240px]">
              {dictionary.forms.models.description}
            </p>
            <button className="bg-primary text-on-primary px-md py-sm text-label-md font-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors">
              {dictionary.forms.models.submit}
            </button>
          </div>
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
    </AdminShell>
  );
}
