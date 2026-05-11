import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  noteTitle: string;
  noteBody: string;
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
      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
        <Card className="glass-panel overflow-hidden">
          <CardHeader className="border-b border-black/5 bg-white/80">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
              {eyebrow}
            </p>
            <CardTitle className="editorial-title text-5xl leading-[0.94] text-black md:text-6xl">
              {title}
            </CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7 text-neutral-600">
              {description}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="glass-panel bg-neutral-50">
          <CardHeader>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              {noteTitle}
            </p>
            <CardDescription className="text-sm leading-6 text-neutral-600">
              {noteBody}
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {summary.map((item) => (
          <Card key={item.label} className="glass-panel">
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                {item.label}
              </p>
              <p className="editorial-title mt-4 text-5xl leading-none text-black">
                {item.value}
              </p>
              <p className="mt-3 text-sm text-neutral-500">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="glass-panel">
        <CardContent className="p-0">
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
                    className="py-10 text-center text-sm text-neutral-500"
                    colSpan={columns.length}
                  >
                    {emptyLabel}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
