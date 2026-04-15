import type { Rarity } from "@/data/colors";

const symbols: Record<Rarity, string> = {
  common: "●",
  uncommon: "◆",
  scarce: "★",
};

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span className={`pill pill-${rarity}`}>
      <span aria-hidden>{symbols[rarity]}</span>
      {rarity}
    </span>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warn";
}) {
  const cls =
    tone === "success"
      ? "bg-[rgba(45,139,70,0.15)] text-[#1F6A33]"
      : tone === "warn"
      ? "bg-[rgba(200,146,42,0.18)] text-[#7A5A10]"
      : "bg-[rgba(61,43,31,0.08)] text-ink";
  return <span className={`pill ${cls}`}>{children}</span>;
}
