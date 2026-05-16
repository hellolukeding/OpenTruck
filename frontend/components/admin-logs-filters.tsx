import Link from "next/link";
import type { LogsPageCopy } from "@/lib/logs-page-copy";

type Props = {
  path: string;
  query: {
    search?: string;
    status?: string;
    model?: string;
    requestKind?: string;
    startAt?: string;
    endAt?: string;
  };
  copy: LogsPageCopy["filters"];
};

export function AdminLogsFilters({ path, query, copy }: Props) {
  return (
    <form action={path} className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.1fr_0.8fr_0.8fr_auto_auto]">
      <InputField name="search" defaultValue={query.search} placeholder={copy.searchPlaceholder} />
      <InputField name="startAt" defaultValue={query.startAt} placeholder={copy.startAtPlaceholder} />
      <InputField name="endAt" defaultValue={query.endAt} placeholder={copy.endAtPlaceholder} />
      <InputField name="model" defaultValue={query.model} placeholder={copy.modelPlaceholder} />
      <InputField name="requestKind" defaultValue={query.requestKind} placeholder={copy.requestKindPlaceholder} />
      <select
        name="status"
        defaultValue={query.status ?? ""}
        className="h-12 rounded-[14px] border border-outline-variant/20 bg-surface px-4 text-[0.94rem] text-on-surface dark:bg-surface-container-low"
      >
        <option value="">{copy.allStatuses}</option>
        <option value="succeeded">succeeded</option>
        <option value="failed">failed</option>
      </select>
      <div className="flex items-center gap-3">
        <button className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.9rem] font-medium text-on-primary">
          {copy.submit}
        </button>
        <Link
          href={path}
          className="rounded-[14px] border border-outline-variant/20 px-4 py-3 text-[0.9rem] text-on-surface"
        >
          {copy.reset}
        </Link>
      </div>
    </form>
  );
}

function InputField({
  name,
  defaultValue,
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  placeholder: string;
}) {
  return (
    <input
      name={name}
      defaultValue={defaultValue ?? ""}
      placeholder={placeholder}
      className="h-12 rounded-[14px] border border-outline-variant/20 bg-surface px-4 text-[0.94rem] text-on-surface-variant dark:bg-surface-container-low"
    />
  );
}
