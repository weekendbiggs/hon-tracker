import { useNavigate } from "react-router-dom";
import { HON_COLORS } from "@/data/colors";
import type { CollectionItem } from "@/api/types";

export default function ProductionTimeline({ collection }: { collection: CollectionItem[] }) {
  const navigate = useNavigate();
  const ownedIds = new Set(collection.map((c) => c.honColorId));
  const sorted = HON_COLORS.slice().sort((a, b) => a.productionStart - b.productionStart);

  const minYear = 1930;
  const maxYear = 2005;
  const range = maxYear - minYear;
  const pxPerYear = 18;
  const totalWidth = range * pxPerYear;

  const decades: number[] = [];
  for (let y = 1930; y <= 2000; y += 10) decades.push(y);

  return (
    <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
      <div style={{ width: totalWidth + 120, minWidth: "100%" }}>
        <div className="relative h-8 mb-3 border-b border-[rgba(61,43,31,0.15)]">
          {decades.map((y) => (
            <div
              key={y}
              className="absolute top-0 text-xs text-subink"
              style={{ left: (y - minYear) * pxPerYear }}
            >
              <div className="h-3 w-px bg-[rgba(61,43,31,0.2)]" />
              <span>{y}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {sorted.map((c) => {
            const left = (c.productionStart - minYear) * pxPerYear;
            const width = Math.max(8, (c.productionEnd - c.productionStart) * pxPerYear);
            const owned = ownedIds.has(c.id);
            return (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-36 text-sm truncate" title={c.name}>
                  {c.name}
                </div>
                <div className="relative flex-1" style={{ height: 22 }}>
                  <button
                    onClick={() => navigate(`/hen/${c.slug}`)}
                    className="absolute top-0 h-full rounded-md transition-transform hover:scale-y-110"
                    style={{
                      left,
                      width,
                      background: owned
                        ? `linear-gradient(135deg, ${c.hexColor}, ${
                            c.hexColorSecondary || c.hexColor
                          })`
                        : "transparent",
                      border: owned ? "none" : `1.5px dashed ${c.hexColor}`,
                      opacity: owned ? 1 : 0.55,
                    }}
                    aria-label={`${c.name} ${c.productionStart}–${c.productionEnd}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
