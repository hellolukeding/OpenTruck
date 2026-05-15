import { CircleHelp, Clock3, FilePlus2, MessageSquareMore, MessagesSquare, ShieldCheck } from "lucide-react";

import type { PaginatedResponse, SupportTicket } from "@/lib/admin-console-api";

export function AdminTicketsPage({
  ticketsPage,
}: {
  ticketsPage: PaginatedResponse<SupportTicket>;
}) {
  const openCount = ticketsPage.items.filter((item) => item.status === "open").length;
  const processingCount = ticketsPage.items.filter((item) => item.status === "processing").length;
  const resolvedCount = ticketsPage.items.filter((item) => item.status === "resolved").length;
  const categories = [
    { label: "待处理", value: String(openCount), color: "bg-[#fff3d6] text-[#b45309]" },
    { label: "处理中", value: String(processingCount), color: "bg-[#eaf5ff] text-[#2563eb]" },
    { label: "已解决", value: String(resolvedCount), color: "bg-[#e9fbf2] text-[#059669]" },
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest shadow-sm dark:bg-surface-container-low/60">
        <div className="flex items-start justify-between border-b border-outline-variant/10 px-5 py-5">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-surface-container-low p-3 text-primary">
              <MessagesSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[1.55rem] font-semibold text-on-surface">工单中心</h2>
              <p className="mt-1 text-[0.9rem] text-on-surface-variant">提交问题、跟踪进度、查看历史回复</p>
            </div>
          </div>
          <button className="rounded-full bg-primary-container px-4 py-2 text-[0.84rem] font-medium text-on-primary">
            <span className="inline-flex items-center gap-2"><FilePlus2 className="h-4 w-4" />新建工单</span>
          </button>
        </div>

        <div className="grid grid-cols-3 divide-x divide-outline-variant/10">
          {categories.map((item) => (
            <div key={item.label} className="px-4 py-5 text-center">
              <div className={`mx-auto inline-flex rounded-full px-3 py-1 text-[0.76rem] font-medium ${item.color}`}>
                {item.label}
              </div>
              <p className="mt-3 text-[2rem] font-semibold text-on-surface">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="px-5 py-5">
          <div className="rounded-[20px] border border-outline-variant/20 bg-surface p-5 dark:bg-surface-container-low">
            <h3 className="text-[1.05rem] font-semibold text-on-surface">提交建议</h3>
            <div className="mt-4 space-y-3">
              <InputRow label="问题类型" placeholder="支付、路由、模型、账单、账号" />
              <InputRow label="优先级" placeholder="普通 / 紧急 / 严重" />
              <InputRow label="联系邮箱" placeholder="operator@company.com" />
              <div>
                <p className="mb-2 text-[0.88rem] font-medium text-on-surface">问题描述</p>
                <div className="min-h-[160px] rounded-[16px] border border-outline-variant/20 bg-surface-container-low px-4 py-4 text-[0.9rem] text-on-surface-variant dark:bg-surface">
                  请尽量提供错误时间、令牌名称、模型名称和 request id，方便快速定位。
                </div>
              </div>
              <button className="w-full rounded-[16px] bg-primary-container px-4 py-3 text-[0.92rem] font-medium text-on-primary">
                提交工单
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest shadow-sm dark:bg-surface-container-low/60">
          <div className="border-b border-outline-variant/10 px-5 py-4">
            <h3 className="text-[1.2rem] font-semibold text-on-surface">支持说明</h3>
          </div>
          <div className="space-y-4 px-5 py-5">
            {[
              { icon: Clock3, title: "响应时间", body: "工作日内普通工单通常在 12 小时内首响，紧急工单会优先处理。" },
              { icon: ShieldCheck, title: "问题升级", body: "涉及支付异常、密钥泄漏、计费错误等问题会自动升级到更高优先级。" },
              { icon: MessageSquareMore, title: "补充信息", body: "你可以在工单中继续追加截图、request id 和上下游账号信息。" },
            ].map((item) => (
              <div key={item.title} className="rounded-[18px] border border-outline-variant/20 bg-surface px-4 py-4 dark:bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-primary" />
                  <p className="text-[1rem] font-semibold text-on-surface">{item.title}</p>
                </div>
                <p className="mt-3 text-[0.88rem] leading-7 text-on-surface-variant">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-outline-variant/20 bg-surface-container-lowest shadow-sm dark:bg-surface-container-low/60">
          <div className="border-b border-outline-variant/10 px-5 py-4">
            <h3 className="text-[1.2rem] font-semibold text-on-surface">最近工单</h3>
          </div>
          <div className="px-5 py-5">
            {ticketsPage.items.length > 0 ? (
              <div className="space-y-3">
                {ticketsPage.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[18px] border border-outline-variant/20 bg-surface px-4 py-4 dark:bg-surface-container-low"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.92rem] font-semibold text-on-surface">{item.subject}</p>
                        <p className="mt-1 text-[0.8rem] text-on-surface-variant">
                          {item.ticket_number} / {item.category} / {item.contact_email}
                        </p>
                      </div>
                      <span className="rounded-full border border-outline-variant/20 px-3 py-1 text-[0.74rem] text-on-surface-variant">
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-[0.88rem] leading-7 text-on-surface-variant">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center">
                <div className="rounded-full bg-surface-container-low p-5 text-on-surface-variant">
                  <CircleHelp className="h-12 w-12" />
                </div>
                <p className="mt-6 text-[1.4rem] font-semibold text-on-surface">暂无工单记录</p>
                <p className="mt-2 text-[0.9rem] text-on-surface-variant">当你提交第一张工单后，处理进度会显示在这里。</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function InputRow({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <p className="mb-2 text-[0.88rem] font-medium text-on-surface">{label}</p>
      <div className="rounded-[14px] border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-[0.9rem] text-on-surface-variant dark:bg-surface">
        {placeholder}
      </div>
    </div>
  );
}
