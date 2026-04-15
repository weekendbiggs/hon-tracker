import { Link } from "react-router-dom";
import { HON_COLORS, ebaySearchUrl, hexToRgb } from "@/data/colors";
import { useCollection } from "@/hooks/useCollection";
import { usePrices } from "@/hooks/usePrices";
import { RarityBadge } from "@/components/ui/Badge";
import HenSilhouette from "@/components/HenSilhouette";
import { ExternalLink } from "lucide-react";

export default function Wishlist() {
  const { items: collection } = useCollection();
  const { items: prices } = usePrices();
  const ownedIds = new Set(collection.map((c) => c.honColorId));
  const missing = HON_COLORS.filter((c) => !ownedIds.has(c.id)).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  if (missing.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-3">🎉</div>
        <h1 className="font-serif text-3xl">You found them all!</h1>
        <p className="text-subink mt-2">22 of 22 HONs collected. A complete heavenly nest.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Wishlist</h1>
      <p className="text-subink mb-5">
        {missing.length} colors still to find. Tap to search eBay.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {missing.map((c) => {
          const rgb = hexToRgb(c.hexColor).join(",");
          const colorPrices = prices.filter((p) => p.honColorId === c.id).map((p) => p.price);
          const min = colorPrices.length ? Math.min(...colorPrices) : null;
          const max = colorPrices.length ? Math.max(...colorPrices) : null;
          return (
            <div
              key={c.id}
              className={`glass-card p-4 missing ${c.isIridescent ? "iridescent" : ""}`}
              style={
                {
                  "--card-rgb": rgb,
                } as React.CSSProperties
              }
            >
              <div className="flex gap-3">
                <div
                  className="w-20 h-20 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `rgba(${rgb},0.2)` }}
                >
                  <HenSilhouette color={`rgba(${rgb},0.7)`} className="w-16 h-16" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/hen/${c.slug}`} className="font-serif text-lg hover:text-gold truncate">
                      {c.name}
                    </Link>
                    <RarityBadge rarity={c.rarity} />
                  </div>
                  <p className="text-xs text-subink">
                    {c.productionStart}–{c.productionEnd}
                  </p>
                  {min != null && (
                    <p className="text-sm mt-1">
                      Seen at ${min.toFixed(0)}
                      {min !== max && `–$${max!.toFixed(0)}`}
                    </p>
                  )}
                  <a
                    href={ebaySearchUrl(c.ebaySearchQuery)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-sm text-gold font-semibold hover:underline"
                  >
                    Search eBay <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
