import Link from "next/link";

type Props = {
  path: string;
  query: {
    search?: string;
    status?: string;
    priority?: string;
  };
};

export function AdminTicketsFilters({ path, query }: Props) {
  return (
    <form action={path} className="grid gap-3 md:grid-cols-[1.1fr_0.8fr_0.8fr_auto_auto]">
      <InputField name="search" defaultValue={query.search} placeholder="按标题、类型、邮箱搜索" />
      <InputField name="priority" defaultValue={query.priority} placeholder="优先级" />
      <select
        name="status"
        defaultValue={query.status ?? ""}
        className="h-12 rounded-[14px] border border-outline-variant/20 bg-surface px-4 text-[0.94rem] text-on-surface dark:bg-surface-container-low"
      >
        <option value="">全部状态</option>
        <option value="open">open</option>
        <option value="processing">processing</option>
        <option value="resolved">resolved</option>
      </select>
      <button className="rounded-[14px] bg-primary-container px-4 py-3 text-[0.9rem] font-medium text-on-primary">
        查询
      </button>
      <Link
        href={path}
        className="rounded-[14px] border border-outline-variant/20 px-4 py-3 text-[0.9rem] text-on-surface"
      >
        重置
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
