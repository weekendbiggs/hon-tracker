import { Link } from "react-router-dom";
import type { HonColor } from "@/data/colors";
import { hexToRgb } from "@/data/colors";
import type { CollectionItem } from "@/api/types";
import { RarityBadge, Badge } from "./ui/Badge";
import HenSilhouette from "./HenSilhouette";

interface Props {
  color: HonColor;
  owned?: CollectionItem[];
}

export default function HonCard({ color, owned = [] }: Props) {
  const isOwned = owned.length > 0;
  const rgb = hexToRgb(color.hexColor).join(",");
  const rgb2 = color.hexColorSecondary ? hexToRgb(color.hexColorSecondary).join(",") : rgb;
  const featured = owned.find((i) => i.isFavorite) ?? owned[0];
  const photoUrl = featured?.photoUrl;

  return (
    <Link
      to={`/hen/${color.slug}`}
      className={`glass-card glass-highlight block p-3 ${color.isIridescent ? "iridescent" : ""} ${
        isOwned ? "" : "missing"
      }`}
      style={
        {
          "--card-rgb": rgb,
          "--card-rgb-2": rgb2,
        } as React.CSSProperties
      }
    >
      {color.isIridescent && <span className="shimmer-rainbow" aria-hidden />}
      <div
        className="aspect-square rounded-lg overflow-hidden mb-3 flex items-center justify-center relative"
        style={{
          background: isOwned
            ? `radial-gradient(120% 80% at 50% 10%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%), linear-gradient(160deg, rgba(${rgb},0.45), rgba(${rgb2},0.70))`
            : `radial-gradient(120% 80% at 50% 10%, rgba(255,255,255,0.7), rgba(255,255,255,0) 55%), linear-gradient(160deg, rgba(${rgb},0.06), rgba(${rgb2},0.12))`,
          boxShadow: isOwned
            ? `inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -12px 20px -8px rgba(${rgb},0.35)`
            : `inset 0 0 0 1px rgba(${rgb},0.18)`,
        }}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={color.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <HenSilhouette
            color={isOwned ? color.hexColor : `rgba(${rgb}, 0.55)`}
            outline={!isOwned}
            className="w-4/5 h-4/5"
            title={color.name}
          />
        )}
        {!isOwned && (
          <span className="absolute top-2 right-2 pill bg-white/85 text-ink">Missing</span>
        )}
        {isOwned && owned.length > 1 && (
          <span className="absolute top-2 right-2 pill bg-white/85 text-ink">
            ×{owned.length}
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-serif text-lg leading-tight truncate">{color.name}</h3>
          <p className="text-xs text-subink">
            {color.productionStart}–{color.productionEnd}
          </p>
        </div>
        <RarityBadge rarity={color.rarity} />
      </div>

      {isOwned && featured && (
        <div className="mt-2 flex flex-wrap gap-1">
          {featured.condition && (
            <Badge tone="success">{featured.condition}</Badge>
          )}
          {featured.dateAcquired && (
            <Badge>{new Date(featured.dateAcquired).getFullYear()}</Badge>
          )}
        </div>
      )}
    </Link>
  );
}
