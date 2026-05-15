type HistoryCardItem = {
  title: string;
  meta: string;
  value: string;
};

export function AdminWalletHistoryCard({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: HistoryCardItem[];
}) {
  return (
    <div className="rounded-[20px] border border-outline-variant/20 bg-surface dark:bg-surface-container-low">
      <div className="border-b border-outline-variant/10 px-5 py-4 text-[1rem] font-semibold text-on-surface">
        {title}
      </div>
      <div className="space-y-3 px-5 py-5">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={`${item.title}-${item.meta}`}
              className="rounded-[16px] border border-outline-variant/20 bg-surface-container-low px-4 py-4 dark:bg-surface"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.92rem] font-medium text-on-surface">{item.title}</p>
                  <p className="mt-1 text-[0.8rem] text-on-surface-variant">{item.meta}</p>
                </div>
                <p className="text-[0.92rem] font-semibold text-on-surface">{item.value}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-[0.92rem] text-on-surface-variant">{empty}</div>
        )}
      </div>
    </div>
  );
}
