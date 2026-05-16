"use client";

import Link from "next/link";

import type { MerchantDashboardData, MerchantModel } from "@/lib/admin-console-api";

export function MerchantModelsTableSection({
  dashboard,
  locale,
}: {
  dashboard: MerchantDashboardData | null;
  locale: string;
}) {
  const models = dashboard?.models ?? [];
  const grouped = groupModels(models);

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
      <div className="flex items-center gap-sm border-b border-outline-variant/20 px-lg py-md">
        <span className="material-symbols-outlined text-primary">model_training</span>
        <h2 className="text-headline-md font-headline-md">
          可用模型 <span className="ml-xs text-secondary">{models.length}</span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-left">
              <th className="px-lg py-sm text-label-md font-medium tracking-wider text-secondary uppercase">
                Model Name
              </th>
              <th className="px-lg py-sm text-right text-label-md font-medium tracking-wider text-secondary uppercase">
                Status / Pricing
              </th>
              <th className="px-lg py-sm text-right text-label-md font-medium tracking-wider text-secondary uppercase">
                Merchants
              </th>
            </tr>
          </thead>
          {grouped.length > 0 ? (
            grouped.map(([category, items]) => (
              <tbody key={category} className="text-body-md">
                <tr className="border-b border-outline-variant/10 bg-surface-container-lowest">
                  <td className="px-lg py-sm font-bold text-primary" colSpan={3}>
                    {category}
                    <span className="ml-sm text-label-md font-normal text-secondary">{items.length}</span>
                  </td>
                </tr>
                {items.map((model) => (
                  <tr
                    key={model.name}
                    className="border-b border-outline-variant/10 transition-colors hover:bg-surface-container-low"
                  >
                    <td className="px-lg py-md">
                      <Link className="font-medium hover:text-primary" href={`/${locale}/logs?model=${encodeURIComponent(model.name)}`}>
                        {model.name}
                      </Link>
                    </td>
                    <td className="px-lg py-md text-right">
                      <span className="mr-sm text-secondary">最低价格:</span>
                      <span className={model.free ? "font-bold text-emerald-500" : "font-bold text-primary"}>
                        {formatPrice(model.lowest_price, model.free)}
                      </span>
                    </td>
                    <td className="px-lg py-md text-right text-on-surface-variant">
                      {model.merchant_count} 个商家提供
                    </td>
                  </tr>
                ))}
              </tbody>
            ))
          ) : (
            <tbody>
              <tr>
                <td className="px-lg py-xl text-center text-body-md text-on-surface-variant" colSpan={3}>
                  暂无可用模型，等上游节点同步后这里会自动出现。
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </section>
  );
}

function groupModels(models: MerchantModel[]) {
  const grouped = new Map<string, MerchantModel[]>();
  for (const model of models) {
    const bucket = grouped.get(model.category) ?? [];
    bucket.push(model);
    grouped.set(model.category, bucket);
  }
  return Array.from(grouped.entries());
}

function formatPrice(value: string, free: boolean) {
  if (free || Number(value) === 0) {
    return "免费/M";
  }
  return `$${Number(value).toFixed(2)}/M`;
}
