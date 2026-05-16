import type { PaymentChannel } from "@/lib/admin-console-api";
import type { WalletPageCopy } from "@/lib/wallet-page-copy-types";
import { AdminWalletChannelActions } from "@/components/admin-wallet-channel-actions";

export function AdminWalletChannelList({
  channels,
  copy,
  formsCopy,
}: {
  channels: PaymentChannel[];
  copy: WalletPageCopy["catalog"];
  formsCopy: WalletPageCopy["forms"];
}) {
  return (
    <div>
      <p className="text-[0.95rem] font-semibold text-on-surface">{copy.chooseChannel}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {channels.map((item) => (
          <div
            key={item.id}
            className={`rounded-[16px] border px-5 py-3 text-[0.95rem] font-medium ${
              item.is_recommended
                ? "border-primary-container bg-surface text-on-surface"
                : "border-outline-variant/20 bg-surface text-on-surface dark:bg-surface-container-low"
            }`}
          >
            <div className="flex items-center gap-3">
              <div>
                <p>{item.name}</p>
                <p className="mt-1 text-[0.74rem] font-normal text-on-surface-variant">
                  {item.provider} / {item.channel_code} / {item.status}
                </p>
              </div>
              <AdminWalletChannelActions channel={item} copy={formsCopy} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
