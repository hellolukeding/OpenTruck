import { CalendarDays, ListFilter, RotateCcw, Search } from "lucide-react";

export function AdminLogsPage() {
  return (
    <section className="rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest shadow-sm dark:bg-surface-container-low/60">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/10 px-5 py-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge text="消耗额度: ¥0.00" tone="teal" />
          <Badge text="RPM: 0" tone="amber" />
          <Badge text="TPM: 0" tone="neutral" />
        </div>
        <button className="text-[1rem] font-semibold text-on-surface">紧凑列表</button>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <InputLike icon={<CalendarDays className="h-4 w-4" />} label="年 / 月 / 日  --:--" />
          <InputLike icon={<CalendarDays className="h-4 w-4" />} label="年 / 月 / 日  --:--" />
          <InputLike icon={<Search className="h-4 w-4" />} label="令牌名称" />
          <InputLike icon={<Search className="h-4 w-4" />} label="模型名称" />
          <InputLike icon={<Search className="h-4 w-4" />} label="分组" />
          <InputLike icon={<Search className="h-4 w-4" />} label="Request ID" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="flex min-w-[96px] items-center justify-between rounded-[14px] border border-outline-variant/20 bg-surface px-4 py-3 text-[0.94rem] text-on-surface dark:bg-surface-container-low">
              全部
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ActionButton icon={<Search className="h-4 w-4" />} label="查询" />
            <ActionButton icon={<RotateCcw className="h-4 w-4" />} label="重置" subtle />
            <ActionButton icon={<ListFilter className="h-4 w-4" />} label="列设置" subtle />
          </div>
        </div>

        <div className="flex min-h-[460px] flex-col items-center justify-center rounded-[20px] border border-outline-variant/10 bg-surface dark:bg-surface-container-low">
          <div className="rounded-full bg-surface-container-low p-5 text-on-surface-variant">
            <Search className="h-12 w-12" />
          </div>
          <p className="mt-6 text-[1.55rem] font-semibold text-on-surface-variant">搜索无结果</p>
        </div>
      </div>
    </section>
  );
}

function Badge({ text, tone }: { text: string; tone: "teal" | "amber" | "neutral" }) {
  const tones = {
    teal: "border-[#cdeee7] bg-[#edf9f6] text-[#0f766e]",
    amber: "border-[#f8deb2] bg-[#fff7e7] text-[#b45309]",
    neutral: "border-outline-variant/20 bg-surface text-on-surface",
  };

  return <div className={`rounded-[16px] border px-5 py-3 text-[0.95rem] font-semibold ${tones[tone]}`}>{text}</div>;
}

function InputLike({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-[14px] border border-outline-variant/20 bg-surface px-4 text-[0.94rem] text-on-surface-variant dark:bg-surface-container-low">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  subtle = false,
}: {
  icon: React.ReactNode;
  label: string;
  subtle?: boolean;
}) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-[14px] border px-4 py-3 text-[0.9rem] font-medium ${
        subtle
          ? "border-outline-variant/20 bg-surface text-on-surface dark:bg-surface-container-low"
          : "border-primary-container bg-primary-container text-on-primary"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
