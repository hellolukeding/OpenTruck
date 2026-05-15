import type { PaymentChannel } from "@/lib/admin-console-api";

export function AdminWalletChannelList({ channels }: { channels: PaymentChannel[] }) {
  return (
    <div>
      <p className="text-[0.95rem] font-semibold text-on-surface">选择支付方式</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {channels.map((item) => (
          <button
            key={item.id}
            className={`rounded-[16px] border px-5 py-3 text-[0.95rem] font-medium ${
              item.is_recommended
                ? "border-primary-container bg-surface text-on-surface"
                : "border-outline-variant/20 bg-surface text-on-surface dark:bg-surface-container-low"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
