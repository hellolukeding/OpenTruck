import Link from "next/link";

import type { TicketsPageCopy } from "@/lib/tickets-page-copy";

type Props = {
  copy: TicketsPageCopy;
  path: string;
  query: {
    search?: string;
    status?: string;
    priority?: string;
    ticketId?: string;
  };
};

export function AdminTicketsFilters({ copy, path, query }: Props) {
  return (
    <form action={path} className="grid gap-3 md:grid-cols-[1.1fr_0.8fr_0.8fr_auto_auto]">
      {query.ticketId ? <input type="hidden" name="ticket_id" value={query.ticketId} /> : null}
      <InputField name="search" defaultValue={query.search} placeholder={copy.filters.searchPlaceholder} />
      <InputField name="priority" defaultValue={query.priority} placeholder={copy.filters.priorityPlaceholder} />
      <select
        name="status"
        defaultValue={query.status ?? ""}
        className="h-12 rounded-[14px] border border-outline-variant/20 bg-surface px-4 text-[0.94rem] text-on-surface dark:bg-surface-container-low"
      >
        <option value="">{copy.filters.allStatuses}</option>
        <option value="open">{copy.enums.status.open}</option>
        <option value="processing">{copy.enums.status.processing}</option>
        <option value="resolved">{copy.enums.status.resolved}</option>
      </select>
      <button className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.9rem] font-medium text-on-primary">
        {copy.filters.submit}
      </button>
      <Link
        href={path}
        className="rounded-[14px] border border-outline-variant/20 px-4 py-3 text-[0.9rem] text-on-surface"
      >
        {copy.filters.reset}
      </Link>
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
