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
      <div
        className="aspect-square rounded-lg overflow-hidden mb-3 flex items-center justify-center relative"
        style={{
          background: `linear-gradient(160deg, rgba(${rgb},0.35), rgba(${rgb2},0.55))`,
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
            color={isOwned ? color.hexColor : `rgba(${rgb}, 0.45)`}
            className="w-3/4 h-3/4"
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
