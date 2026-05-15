import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SummaryStat = {
  label: string;
  value: string | number;
  note: string;
};

type Column<T> = {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
};

type ResourceTableCardProps<T> = {
  eyebrow: string;
  title: string;
  description: string;
  emptyLabel: string;
  summary: SummaryStat[];
  columns: Column<T>[];
  items: T[];
  noteTitle?: string;
  noteBody?: string;
};

export function statusVariant(status: string): "default" | "secondary" | "success" | "warning" {
  const normalized = status.toLowerCase();
  if (normalized === "active" || normalized === "ok") return "success";
  if (normalized === "unknown" || normalized === "degraded") return "warning";
  return "secondary";
}

export function ResourceStatusBadge({ status }: { status: string }) {
  return <Badge variant={statusVariant(status)}>{status}</Badge>;
}

export function ResourceTableCard<T>({
  eyebrow,
  title,
  description,
  emptyLabel,
  summary,
  columns,
  items,
  noteTitle,
  noteBody,
}: ResourceTableCardProps<T>) {
  return (
    <>
      <section className="flex flex-col gap-3 px-2 pt-2">
        <span className="font-code-sm uppercase tracking-[0.2em] text-on-surface-variant">
          {eyebrow}
        </span>
        <h1 className="text-[2.35rem] font-semibold tracking-[-0.06em] text-on-surface">
          {title}
        </h1>
        <p className="max-w-[42rem] text-[0.98rem] leading-7 text-on-surface-variant">
          {description}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {summary.map((item) => (
          <Card
            key={item.label}
            className="rounded-[22px] border-outline-variant/20 bg-surface-container-lowest shadow-sm dark:bg-surface-container-low/60"
          >
            <CardContent className="flex flex-col gap-3 p-5">
              <span className="text-[0.78rem] uppercase tracking-[0.14em] text-on-surface-variant">
                {item.label}
              </span>
              <span className="text-[2.6rem] font-semibold leading-none tracking-[-0.05em] text-primary">
                {item.value}
              </span>
              <span className="text-[0.84rem] text-on-surface-variant">{item.note}</span>
            </CardContent>
          </Card>
        ))}
      </section>

      {noteTitle && noteBody && (
        <Card className="rounded-[24px] border-outline-variant/20 bg-surface-container-lowest shadow-sm dark:bg-surface-container-low/50">
          <CardContent className="flex flex-col gap-2 border-l-2 border-primary p-5">
            <span className="text-[0.82rem] uppercase tracking-[0.12em] text-primary">
              {noteTitle}
            </span>
            <p className="text-[0.95rem] leading-7 text-on-surface-variant">{noteBody}</p>
          </CardContent>
        </Card>
      )}

      <Card className="overflow-hidden rounded-[24px] border-outline-variant/20 shadow-sm dark:bg-surface-container-low/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-surface-container-low">
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{column.render(item)}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="py-xl text-center font-body-md text-body-md text-on-surface-variant"
                  colSpan={columns.length}
                >
                  {emptyLabel}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
