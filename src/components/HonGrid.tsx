import type { HonColor } from "@/data/colors";
import type { CollectionItem } from "@/api/types";
import HonCard from "./HonCard";

export default function HonGrid({
  colors,
  collection,
}: {
  colors: HonColor[];
  collection: CollectionItem[];
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {colors.map((c) => (
        <HonCard
          key={c.id}
          color={c}
          owned={collection.filter((i) => i.honColorId === c.id)}
        />
      ))}
    </div>
  );
}
