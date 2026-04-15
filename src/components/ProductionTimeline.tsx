import { useNavigate } from "react-router-dom";
import { HON_COLORS } from "@/data/colors";
import type { CollectionItem } from "@/api/types";

const MIN_YEAR = 1930;
const MAX_YEAR = 2005;
const PX_PER_YEAR = 20;
const LABEL_WIDTH = 136;
const BAR_WIDTH = (MAX_YEAR - MIN_YEAR) * PX_PER_YEAR;

export default function ProductionTimeline({ collection }: { collection: CollectionItem[] }) {
  const navigate = useNavigate();
  const ownedIds = new Set(collection.map((c) => c.honColorId));
  const sorted = HON_COLORS.slice().sort((a, b) => a.productionStart - b.productionStart);

  const decades: number[] = [];
  for (let y = MIN_YEAR; y <= MAX_YEAR; y += 10) decades.push(y);

  return (
    <div className="bg-white rounded-xl border border-[rgba(61,43,31,0.1)] overflow-hidden">
      <div className="overflow-x-auto overflow-y-hidden">
        <div style={{ width: LABEL_WIDTH + BAR_WIDTH + 24 }}>
          {/* Decade axis */}
          <div
            className="relative h-8 border-b border-[rgba(61,43,31,0.12)] bg-[rgba(252,248,240,0.9)]"
            style={{ marginLeft: LABEL_WIDTH }}
          >
            {decades.map((y) => (
              <div
                key={y}
                className="absolute top-0 text-[11px] text-subink"
                style={{ left: (y - MIN_YEAR) * PX_PER_YEAR }}
              >
                <div className="h-2 w-px bg-[rgba(61,43,31,0.25)]" />
                <span className="block -translate-x-1/2 mt-0.5">{y}</span>
              </div>
            ))}
          </div>

          {/* Rows */}
          <div>
            {sorted.map((c, idx) => {
              const left = (c.productionStart - MIN_YEAR) * PX_PER_YEAR;
              const width = Math.max(10, (c.productionEnd - c.productionStart) * PX_PER_YEAR);
              const owned = ownedIds.has(c.id);
              return (
                <div
                  key={c.id}
                  className="flex items-center"
                  style={{
                    background: idx % 2 ? "rgba(252,248,240,0.5)" : "transparent",
                  }}
                >
                  <div
                    className="sticky left-0 z-10 text-xs truncate py-2 px-3 bg-white border-r border-[rgba(61,43,31,0.08)]"
                    style={{ width: LABEL_WIDTH, minWidth: LABEL_WIDTH }}
                    title={c.name}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                      style={{ background: c.hexColor }}
                    />
                    {c.name}
                  </div>
                  <div className="relative py-1.5" style={{ width: BAR_WIDTH, height: 28 }}>
                    <button
                      onClick={() => navigate(`/hen/${c.slug}`)}
                      className="absolute top-1.5 h-5 rounded-md transition-transform hover:scale-y-110 hover:shadow-md"
                      style={{
                        left,
                        width,
                        background: owned
                          ? `linear-gradient(135deg, ${c.hexColor}, ${
                              c.hexColorSecondary || c.hexColor
                            })`
                          : "transparent",
                        border: owned
                          ? `1px solid rgba(0,0,0,0.08)`
                          : `1.5px dashed ${c.hexColor}`,
                        opacity: owned ? 1 : 0.55,
                        boxShadow: owned ? "inset 0 1px 0 rgba(255,255,255,0.5)" : "none",
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
      <p className="text-[11px] text-subink px-3 py-2 border-t border-[rgba(61,43,31,0.08)]">
        Swipe horizontally to see the full production range. Dashed = missing, filled = owned.
      </p>
    </div>
  );
}
