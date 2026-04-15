import ProductionTimeline from "@/components/ProductionTimeline";
import { useCollection } from "@/hooks/useCollection";

export default function Timeline() {
  const { items } = useCollection();
  return (
    <div>
      <h1 className="font-serif text-3xl mb-1">Production Timeline</h1>
      <p className="text-subink mb-5 text-sm">
        70 years of Indiana Glass hen-on-nest production, color by color. Scroll
        horizontally. Solid bars are colors in the collection; dashed outlines are
        still on the wishlist.
      </p>
      <ProductionTimeline collection={items} />
    </div>
  );
}
