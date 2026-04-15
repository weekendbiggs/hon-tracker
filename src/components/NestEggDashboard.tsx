import type { CollectionItem, PriceEntry } from "@/api/types";

export function estimateValue(
  collection: CollectionItem[],
  prices: PriceEntry[],
): { total: number; invested: number; byColor: Map<number, number> } {
  const byColor = new Map<number, number[]>();
  for (const p of prices) {
    const arr = byColor.get(p.honColorId) ?? [];
    arr.push(p.price);
    byColor.set(p.honColorId, arr);
  }
  const avgByColor = new Map<number, number>();
  for (const [id, arr] of byColor) {
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    avgByColor.set(id, avg);
  }
  let total = 0;
  let invested = 0;
  for (const item of collection) {
    invested += item.purchasePrice ?? 0;
    const mkt = avgByColor.get(item.honColorId);
    total += mkt ?? item.purchasePrice ?? 0;
  }
  return { total, invested, byColor: avgByColor };
}

export default function NestEggDashboard({
  collection,
  prices,
}: {
  collection: CollectionItem[];
  prices: PriceEntry[];
}) {
  const { total, invested } = estimateValue(collection, prices);
  const delta = total - invested;
  const pct = invested > 0 ? (delta / invested) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[rgba(61,43,31,0.1)] shadow-glass">
      <div className="text-xs uppercase tracking-wide text-subink">Nest egg — estimated value</div>
      <div className="font-serif text-4xl md:text-5xl text-ink mt-1">
        ${total.toFixed(0)}
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-sm">
        <span className="text-subink">
          Invested: <span className="font-semibold text-ink">${invested.toFixed(0)}</span>
        </span>
        {invested > 0 && (
          <span className={delta >= 0 ? "text-success" : "text-[#9B1B30]"}>
            {delta >= 0 ? "▲" : "▼"} ${Math.abs(delta).toFixed(0)} ({pct.toFixed(1)}%)
          </span>
        )}
      </div>
    </div>
  );
}
