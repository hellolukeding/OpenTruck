import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type StatusOption = {
  value: string;
  label: string;
};

type ResourceFiltersProps = {
  locale: "en" | "zh-CN";
  path: string;
  search?: string;
  status?: string;
  statusOptions?: StatusOption[];
};

export function ResourceFilters({
  locale,
  path,
  search,
  status,
  statusOptions = [],
}: ResourceFiltersProps) {
  const copy =
    locale === "zh-CN"
      ? {
          searchPlaceholder: "按名称、区域或模型搜索",
          statusLabel: "状态",
          allStatuses: "全部状态",
          apply: "应用筛选",
          clear: "清空",
        }
      : {
          searchPlaceholder: "Search by name, region, or model",
          statusLabel: "Status",
          allStatuses: "All statuses",
          apply: "Apply filters",
          clear: "Clear",
        };

  return (
    <form action={path} className="grid gap-sm rounded-2xl border border-outline-variant bg-surface p-md md:grid-cols-[minmax(0,1fr)_180px_auto_auto] md:items-end">
      <div className="grid gap-2">
        <label className="font-code-sm text-code-sm uppercase tracking-wide text-on-surface-variant">
          Search
        </label>
        <Input name="search" defaultValue={search ?? ""} placeholder={copy.searchPlaceholder} />
      </div>
      <div className="grid gap-2">
        <label className="font-code-sm text-code-sm uppercase tracking-wide text-on-surface-variant">
          {copy.statusLabel}
        </label>
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-10 rounded-lg border border-outline-variant bg-surface px-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
        >
          <option value="">{copy.allStatuses}</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit">{copy.apply}</Button>
      <Link
        href={path}
        className="inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent px-md py-sm text-label-md font-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
      >
        {copy.clear}
      </Link>
    </form>
  );
}
