import { BadgeDollarSign, Banknote, CircleDollarSign, Copy, Crown, Gift, WalletCards } from "lucide-react";

import { AdminWalletHistoryCard } from "@/components/admin-wallet-history-card";
import { AdminWalletOrderForm } from "@/components/admin-wallet-order-form";
import { AdminWalletOrderRow } from "@/components/admin-wallet-order-row";
import type { WalletOverviewData } from "@/lib/admin-console-api";

function StatPanel({
  title,
  values,
  actions,
}: {
  title: string;
  values: Array<{ label: string; value: string; icon: string }>;
  actions?: string[];
}) {
  return (
    <div className="rounded-[20px] bg-[linear-gradient(135deg,#55d9b4_0%,#73c7c0_100%)] p-5 text-white shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-[1.1rem] font-semibold">{title}</h3>
        {actions ? (
          <div className="flex items-center gap-2">
            {actions.map((action) => (
              <button
                key={action}
                className="rounded-full bg-white/14 px-3 py-1.5 text-[0.74rem] font-medium transition-colors hover:bg-white/20"
              >
                {action}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {values.map((item) => (
          <div key={item.label}>
            <p className="text-[0.76rem] opacity-90">{item.value}</p>
            <p className="mt-2 flex items-center gap-1.5 text-[0.8rem] opacity-95">
              <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminWalletPage({ wallet }: { wallet: WalletOverviewData | null }) {
  const amountOptions = ["68 ￥", "136 ￥", "340 ￥", "680 ￥", "1360 ￥", "3400 ￥"];
  const balance = wallet ? formatMoney(wallet.balance) : "¥0.00";
  const spent = wallet ? formatMoney(wallet.total_spent) : "¥0.00";
  const requestCount = wallet ? String(wallet.total_requests) : "0";
  const rechargeTotal = wallet ? formatMoney(wallet.total_recharged) : "¥0.00";
  const successCount = wallet ? String(wallet.successful_requests) : "0";
  const failedCount = wallet ? String(wallet.failed_requests) : "0";

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-surface-container-low p-3 text-primary">
            <WalletCards className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[1.55rem] font-semibold text-on-surface">账户充值</h2>
            <p className="mt-1 text-[0.9rem] text-on-surface-variant">多种充值方式，安全便捷</p>
          </div>
        </div>
        <button className="rounded-full bg-primary-container px-4 py-2 text-[0.84rem] font-medium text-on-primary">
          账单
        </button>
      </div>

      {/* Stats panel */}
      <StatPanel
        title="账户统计"
        values={[
          { label: "当前余额", value: balance, icon: "account_balance_wallet" },
          { label: "历史消耗", value: spent, icon: "monitoring" },
          { label: "请求次数", value: requestCount, icon: "bar_chart" },
        ]}
      />

      {/* Two-column layout: recharge form | payment + affiliate */}
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left column: recharge */}
        <div className="space-y-6">
          <div>
            <label className="text-[0.95rem] font-semibold text-on-surface">充值数量</label>
            <input
              defaultValue="7"
              className="mt-3 h-12 w-full rounded-[16px] border border-outline-variant/20 bg-surface px-4 text-[1rem] text-on-surface outline-none dark:bg-surface-container-low"
            />
            <p className="mt-3 text-[0.96rem] text-on-surface-variant">
              实付金额: <span className="text-[#ef4444]">¥6.80</span>
            </p>
          </div>

          <div>
            <p className="text-[0.95rem] font-semibold text-on-surface">
              选择充值额度 <span className="text-[0.82rem] text-on-surface-variant">(1 $ = 6.80 ￥)</span>
            </p>
            <div className="mt-3 rounded-[16px] border border-[#f2cb6b] bg-[#fff8e7] px-4 py-3 text-[0.9rem] text-[#8a4f11]">
              充值以及大客户经理微信: LHSSOS
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {amountOptions.map((item) => (
                <button
                  key={item}
                  className="rounded-[18px] border border-outline-variant/20 bg-surface px-4 py-4 text-left transition-colors hover:bg-surface-container-low dark:bg-surface-container-low"
                >
                  <p className="flex items-center gap-2 text-[1.05rem] font-semibold text-on-surface">
                    <CircleDollarSign className="h-5 w-5" />
                    {item}
                  </p>
                  <p className="mt-3 text-[0.84rem] leading-6 text-on-surface-variant">
                    实付 {item.replace(" ￥", ".00")}，节省 ¥0.00
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Redeem code */}
          <div className="rounded-[20px] border border-outline-variant/20 bg-surface dark:bg-surface-container-low">
            <div className="border-b border-outline-variant/10 px-5 py-4 text-[1rem] font-semibold text-on-surface">
              兑换码充值
            </div>
            <div className="px-5 py-5">
              <div className="flex overflow-hidden rounded-[16px] border border-outline-variant/20">
                <div className="flex flex-1 items-center gap-3 bg-surface px-4 py-3 text-on-surface-variant dark:bg-surface-container-low">
                  <Gift className="h-4 w-4" />
                  请输入兑换码
                </div>
                <button className="bg-primary-container px-5 text-[0.88rem] font-medium text-on-primary">
                  兑换额度
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: payment methods + affiliate */}
        <div className="space-y-6">
          <div>
            <p className="text-[0.95rem] font-semibold text-on-surface">选择支付方式</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {["支付宝(推荐)", "Stripe", "USDT/USDC"].map((item, index) => (
                <button
                  key={item}
                  className={`rounded-[16px] border px-5 py-3 text-[0.95rem] font-medium ${
                    index === 0
                      ? "border-primary-container bg-surface text-on-surface"
                      : "border-outline-variant/20 bg-surface text-on-surface dark:bg-surface-container-low"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-outline-variant/20 bg-surface dark:bg-surface-container-low">
            <div className="border-b border-outline-variant/10 px-5 py-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-surface-container-low p-3 text-primary">
                  <BadgeDollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-[1.55rem] font-semibold text-on-surface">平台成长计划</h2>
                  <p className="mt-1 text-[0.9rem] text-on-surface-variant">邀请好友，持续获得消费佣金</p>
                </div>
              </div>
            </div>
            <div className="p-5">
              <StatPanel
                title="佣金统计"
                actions={["提现", "划转到余额"]}
                values={[
                  { label: "累计充值", value: rechargeTotal, icon: "monitoring" },
                  { label: "成功请求", value: successCount, icon: "bar_chart" },
                  { label: "失败请求", value: failedCount, icon: "group" },
                ]}
              />
              <div className="mt-5 overflow-hidden rounded-[16px] border border-outline-variant/20">
                <div className="grid grid-cols-[140px_1fr_96px]">
                  <div className="bg-surface-container-low px-4 py-3 text-[0.9rem] font-medium text-on-surface-variant">邀请链接</div>
                  <div className="truncate bg-surface px-4 py-3 text-[0.9rem] text-on-surface">https://subrouter.ai/register?aff=40Eq</div>
                  <button className="bg-primary-container px-4 text-[0.9rem] font-medium text-on-primary">
                    <span className="inline-flex items-center gap-2"><Copy className="h-4 w-4" />复制</span>
                  </button>
                </div>
              </div>
              <div className="mt-5 rounded-[16px] border border-outline-variant/20">
                <div className="border-b border-outline-variant/10 px-4 py-3 text-[0.95rem] font-medium text-on-surface-variant">佣金说明</div>
                <div className="space-y-4 px-4 py-4 text-[0.9rem] text-on-surface">
                  {[
                    "邀请好友注册后，好友每次消费您都将获得 2.5% 的佣金",
                    "佣金可申请提现或划转到账户余额使用",
                    "邀请的好友越多，持续收益越高",
                  ].map((item) => (
                    <p key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-3 w-3 rounded-full bg-primary-container" />
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </div>
              <div className="mt-5 rounded-[16px] border border-outline-variant/20">
                <div className="border-b border-outline-variant/10 px-4 py-3 text-[0.95rem] font-medium text-on-surface-variant">KOL 合作</div>
                <div className="flex items-center justify-between gap-4 px-4 py-4">
                  <p className="text-[0.9rem] text-on-surface">申请成为 KOL，获得更高返佣比例</p>
                  <button className="rounded-full bg-primary-container px-4 py-2 text-[0.84rem] font-medium text-on-primary">
                    <span className="inline-flex items-center gap-2"><Crown className="h-4 w-4" />申请成为 KOL</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription section */}
      <div className="rounded-[20px] border border-outline-variant/20 bg-surface dark:bg-surface-container-low">
        <div className="flex items-center justify-between border-b border-outline-variant/10 px-5 py-4">
          <div>
            <div className="flex items-center gap-3">
              <Banknote className="h-5 w-5 text-primary" />
              <h3 className="text-[1.2rem] font-semibold text-on-surface">订阅套餐</h3>
            </div>
            <p className="mt-1 text-[0.88rem] text-on-surface-variant">购买订阅获得模型额度/次数</p>
          </div>
          <button className="rounded-full border border-outline-variant/20 px-4 py-2 text-[0.82rem] text-on-surface">优先订阅</button>
        </div>
        <div className="px-5 py-5">
          <div className="rounded-[16px] border border-outline-variant/20 bg-surface-container-low px-4 py-4 dark:bg-surface">
            <div className="flex items-center gap-3">
              <h4 className="text-[1.05rem] font-semibold text-on-surface">我的订阅</h4>
              <span className="rounded-full border border-outline-variant/20 px-3 py-1 text-[0.74rem] text-on-surface-variant">无生效</span>
            </div>
            <p className="mt-3 text-[0.88rem] text-on-surface-variant">购买套餐后即可享受模型权益</p>
          </div>
          <div className="py-12 text-center text-[1rem] text-on-surface-variant">暂无可购买套餐</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          {wallet ? <AdminWalletOrderForm tenantId={wallet.tenant_id} /> : null}
          <div className="rounded-[20px] border border-outline-variant/20 bg-surface dark:bg-surface-container-low">
            <div className="border-b border-outline-variant/10 px-5 py-4 text-[1rem] font-semibold text-on-surface">
              最近充值单
            </div>
            <div className="space-y-3 px-5 py-5">
              {wallet && wallet.recent_orders.length > 0 ? (
                wallet.recent_orders.map((order) => <AdminWalletOrderRow key={order.id} order={order} />)
              ) : (
                <div className="py-8 text-center text-[0.92rem] text-on-surface-variant">暂无充值订单</div>
              )}
            </div>
          </div>
        </div>
        <AdminWalletHistoryCard
          title="最近账本记录"
          empty="暂无账本变动"
          items={(wallet?.recent_entries ?? []).map((item) => ({
            title: item.description,
            meta: `${item.direction} / 余额 ${formatMoney(item.balance_after)}`,
            value: formatMoney(item.amount),
          }))}
        />
      </div>
    </div>
  );
}

function formatMoney(value: string) {
  return `¥${Number(value || 0).toFixed(2)}`;
}
