"use client";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabLabels = [
  { value: "spend-distribution", label: "消耗分布" },
  { value: "spend-trend", label: "消耗趋势" },
  { value: "requests-distribution", label: "调用次数分布" },
  { value: "requests-ranking", label: "调用次数排行" },
];

const points = ["05-15 07:00", "05-15 08:00", "05-15 09:00", "05-15 10:00", "05-15 11:00", "05-15 12:00", "05-15 13:00"];

export function AdminOverviewAnalysis() {
  return (
    <section className="rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest shadow-sm dark:bg-surface-container-low/60">
      <div className="flex flex-col gap-4 border-b border-outline-variant/10 px-5 py-4 md:flex-row md:items-center md:justify-between">

        <Tabs defaultValue="spend-distribution" className="w-full md:w-auto">
          <TabsList className="w-full justify-start rounded-2xl bg-surface-container-low px-1 py-1 md:w-auto">
            {tabLabels.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-xl px-4 py-2 text-[0.82rem] data-[state=active]:shadow-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabLabels.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              <AnalysisCanvas title={tab.label === "消耗分布" ? "模型消耗分布" : tab.label} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

function AnalysisCanvas({ title }: { title: string }) {
  return (
    <div className="px-5 py-6">
      <h3 className="text-[1.05rem] font-semibold text-on-surface">{title}</h3>
      <p className="mt-1 text-[0.86rem] text-on-surface-variant">总计： ¥0.00</p>
      <div className="mt-6 rounded-[20px] border border-outline-variant/10 bg-surface px-4 py-4 dark:bg-surface-container-low">
        <svg viewBox="0 0 980 360" className="h-[360px] w-full">
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <line
              key={row}
              x1="56"
              x2="940"
              y1={44 + row * 56}
              y2={44 + row * 56}
              stroke="rgba(148,163,184,0.22)"
              strokeWidth="1"
            />
          ))}
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <line
              key={index}
              x1={56 + index * 126}
              x2={56 + index * 126}
              y1="44"
              y2="324"
              stroke="rgba(148,163,184,0.08)"
              strokeWidth="1"
            />
          ))}
          {[1, 0.8, 0.6, 0.4, 0.2, 0].map((tick, index) => (
            <text key={tick} x="18" y={49 + index * 56} fill="currentColor" className="text-[12px] text-on-surface-variant">
              {tick}
            </text>
          ))}
          {points.map((point, index) => (
            <text key={point} x={96 + index * 126} y="346" fill="currentColor" className="text-[12px] text-on-surface-variant">
              {point}
            </text>
          ))}
          <line x1="56" x2="940" y1="324" y2="324" stroke="rgba(148,163,184,0.28)" strokeWidth="1.2" />
        </svg>
        <div className="mt-3 flex items-center justify-center gap-2 text-[0.84rem] text-on-surface">
          <span className="h-3 w-3 bg-[#ff9800]" />
          <span>无数据</span>
        </div>
      </div>
    </div>
  );
}
