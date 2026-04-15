import { useMemo, useState } from "react";
import { HON_COLORS, type Rarity } from "@/data/colors";
import { useCollection } from "@/hooks/useCollection";
import CompletenessRing from "@/components/CompletenessRing";
import HonGrid from "@/components/HonGrid";
import BeadedBorder from "@/components/BeadedBorder";
import { CONFIG } from "@/config";

type Filter = "all" | "owned" | "missing" | Rarity;
type Sort = "chrono" | "rarity" | "recent";

const rarityOrder: Record<Rarity, number> = { scarce: 0, uncommon: 1, common: 2 };

export default function Gallery() {
  const { items: collection, loading } = useCollection();
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("chrono");

  const ownedIds = useMemo(() => new Set(collection.map((c) => c.honColorId)), [collection]);

  const colors = useMemo(() => {
    let list = [...HON_COLORS];
    if (filter === "owned") list = list.filter((c) => ownedIds.has(c.id));
    else if (filter === "missing") list = list.filter((c) => !ownedIds.has(c.id));
    else if (filter === "common" || filter === "uncommon" || filter === "scarce")
      list = list.filter((c) => c.rarity === filter);

    if (sort === "chrono") list.sort((a, b) => a.displayOrder - b.displayOrder);
    else if (sort === "rarity") list.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
    else if (sort === "recent") {
      const latestByColor = new Map<number, string>();
      for (const it of collection) {
        const cur = latestByColor.get(it.honColorId);
        if (!cur || it.createdAt > cur) latestByColor.set(it.honColorId, it.createdAt);
      }
      list.sort((a, b) => (latestByColor.get(b.id) ?? "").localeCompare(latestByColor.get(a.id) ?? ""));
    }
    return list;
  }, [filter, sort, ownedIds, collection]);

  const ownedCount = ownedIds.size;
  const totalValue = collection.reduce((s, i) => s + (i.purchasePrice ?? 0), 0);
  const earliest = collection
    .map((c) => c.dateAcquired)
    .filter(Boolean)
    .sort()[0];
  const years = earliest
    ? Math.max(1, new Date().getFullYear() - new Date(earliest).getFullYear())
    : 0;

  return (
    <div>
      <section className="text-center mb-6">
        <h1 className="font-serif text-3xl md:text-5xl mb-1">{CONFIG.siteTitle}</h1>
        <p className="text-subink text-sm md:text-base">{CONFIG.siteTagline}</p>
      </section>

      <section className="flex flex-col items-center mb-6">
        <CompletenessRing collection={collection} />
        <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm">
          <Stat label="items owned" value={collection.length} />
          <Stat label="estimated value" value={`$${totalValue.toFixed(0)}`} />
          {years > 0 && <Stat label={`year${years === 1 ? "" : "s"} collecting`} value={years} />}
        </div>
      </section>

      <BeadedBorder className="my-6" />

      <section className="mb-4 flex flex-wrap items-center gap-2">
        <FilterChip val="all" filter={filter} setFilter={setFilter}>All</FilterChip>
        <FilterChip val="owned" filter={filter} setFilter={setFilter}>Owned ({ownedCount})</FilterChip>
        <FilterChip val="missing" filter={filter} setFilter={setFilter}>Missing ({22 - ownedCount})</FilterChip>
        <span className="mx-2 h-5 w-px bg-[rgba(61,43,31,0.15)]" />
        <FilterChip val="common" filter={filter} setFilter={setFilter}>Common</FilterChip>
        <FilterChip val="uncommon" filter={filter} setFilter={setFilter}>Uncommon</FilterChip>
        <FilterChip val="scarce" filter={filter} setFilter={setFilter}>Scarce</FilterChip>
        <div className="ml-auto">
          <label className="text-xs text-subink mr-2">Sort</label>
          <select
            className="text-sm bg-white border border-[rgba(61,43,31,0.18)] rounded-md px-2 py-1"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
          >
            <option value="chrono">Chronological</option>
            <option value="rarity">Rarity</option>
            <option value="recent">Recently added</option>
          </select>
        </div>
      </section>

      {loading && collection.length === 0 ? (
        <HonGrid colors={colors} collection={[]} />
      ) : (
        <HonGrid colors={colors} collection={collection} />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <div className="font-serif text-2xl md:text-3xl text-ink">{value}</div>
      <div className="text-xs uppercase tracking-wide text-subink">{label}</div>
    </div>
  );
}

function FilterChip<V extends string>({
  val,
  filter,
  setFilter,
  children,
}: {
  val: V;
  filter: string;
  setFilter: (v: V) => void;
  children: React.ReactNode;
}) {
  const active = val === filter;
  return (
    <button
      onClick={() => setFilter(val)}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-ink text-warm"
          : "bg-white text-ink border border-[rgba(61,43,31,0.15)] hover:bg-[#F5F0E8]"
      }`}
    >
      {children}
    </button>
  );
}
