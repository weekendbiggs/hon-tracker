import { Link } from "react-router-dom";
import { HON_COLORS, hexToRgb } from "@/data/colors";
import { useCollection } from "@/hooks/useCollection";
import { usePrices } from "@/hooks/usePrices";
import NestEggDashboard from "@/components/NestEggDashboard";
import PriceChart from "@/components/PriceChart";
import BeadedBorder from "@/components/BeadedBorder";
import { useAdmin } from "@/hooks/useAdmin";
import Button from "@/components/ui/Button";
import { LineChart as LineChartIcon } from "lucide-react";

export default function Market() {
  const { items: collection } = useCollection();
  const { items: prices } = usePrices();
  const { signedIn } = useAdmin();

  const byColor = new Map<number, typeof prices>();
  for (const p of prices) {
    const arr = byColor.get(p.honColorId) ?? [];
    arr.push(p);
    byColor.set(p.honColorId, arr);
  }

  const colorCards = HON_COLORS.filter((c) => byColor.has(c.id)).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-4">
        <h1 className="font-serif text-3xl">Market</h1>
        {signedIn && (
          <Link to="/admin/prices">
            <Button size="sm">
              <LineChartIcon size={14} className="inline mr-1" /> Log a price
            </Button>
          </Link>
        )}
      </div>

      <NestEggDashboard collection={collection} prices={prices} />

      <BeadedBorder className="my-6" />

      {colorCards.length === 0 ? (
        <p className="text-subink text-sm">
          No price observations yet.{" "}
          {signedIn ? (
            <Link to="/admin/prices" className="text-gold underline">
              Log your first one
            </Link>
          ) : (
            "Sign in to start logging prices."
          )}
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {colorCards.map((c) => {
            const pts = byColor.get(c.id)!;
            const sorted = pts.slice().sort((a, b) => a.dateObserved.localeCompare(b.dateObserved));
            const min = Math.min(...pts.map((p) => p.price));
            const max = Math.max(...pts.map((p) => p.price));
            const avg = pts.reduce((s, p) => s + p.price, 0) / pts.length;
            const rgb = hexToRgb(c.hexColor).join(",");
            return (
              <Link
                key={c.id}
                to={`/hen/${c.slug}`}
                className="glass-card p-4 block"
                style={
                  {
                    "--card-rgb": rgb,
                  } as React.CSSProperties
                }
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-serif text-lg">{c.name}</div>
                    <div className="text-xs text-subink">{pts.length} observations</div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-2xl">${avg.toFixed(0)}</div>
                    <div className="text-xs text-subink">
                      ${min.toFixed(0)}–${max.toFixed(0)}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <PriceChart
                    prices={sorted.slice(-8)}
                    strokeColor={c.hexColor}
                    height={70}
                    showAxes={false}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
