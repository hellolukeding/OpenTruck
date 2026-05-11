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
  if (normalized === "unknown" || normalized === "paused") return "warning";
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
      {/* Page Header + Note */}
      <section className="flex flex-col gap-sm">
        <div className="flex items-center gap-sm">
          <span className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-wider">
            {eyebrow}
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-primary">{title}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
      </section>

      {/* Summary Stats */}
      <section className="grid gap-md grid-cols-3">
        {summary.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-lg flex flex-col gap-sm">
              <span className="font-label-md text-label-md text-on-surface-variant">
                {item.label}
              </span>
              <span className="font-headline-lg text-headline-lg text-primary">
                {item.value}
              </span>
              <span className="font-code-sm text-code-sm text-on-surface-variant">
                {item.note}
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Note Card */}
      {noteTitle && noteBody && (
        <Card>
          <CardContent className="p-lg flex flex-col gap-xs border-l-2 border-primary">
            <span className="font-label-md text-label-md text-primary">{noteTitle}</span>
            <p className="font-body-md text-body-md text-on-surface-variant">{noteBody}</p>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
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
