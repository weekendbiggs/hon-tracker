import { Link, useNavigate, useParams } from "react-router-dom";
import { colorBySlug, HON_COLORS, ebaySearchUrl, hexToRgb } from "@/data/colors";
import { useCollection } from "@/hooks/useCollection";
import { usePrices } from "@/hooks/usePrices";
import { useAdmin } from "@/hooks/useAdmin";
import { RarityBadge, Badge } from "@/components/ui/Badge";
import HenSilhouette from "@/components/HenSilhouette";
import PriceChart from "@/components/PriceChart";
import Button from "@/components/ui/Button";
import BeadedBorder from "@/components/BeadedBorder";
import { ArrowLeft, ArrowRight, ExternalLink, Pencil } from "lucide-react";

export default function HenDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { signedIn } = useAdmin();
  const color = slug ? colorBySlug(slug) : undefined;
  const { items: collection } = useCollection();
  const { items: prices } = usePrices();

  if (!color) {
    return (
      <div className="text-center py-16">
        <p className="text-subink">Unknown HON color.</p>
        <Link to="/" className="text-gold underline">Back to gallery</Link>
      </div>
    );
  }

  const ordered = HON_COLORS.slice().sort((a, b) => a.displayOrder - b.displayOrder);
  const idx = ordered.findIndex((c) => c.id === color.id);
  const prev = ordered[(idx - 1 + ordered.length) % ordered.length];
  const next = ordered[(idx + 1) % ordered.length];

  const owned = collection.filter((c) => c.honColorId === color.id);
  const colorPrices = prices
    .filter((p) => p.honColorId === color.id)
    .sort((a, b) => a.dateObserved.localeCompare(b.dateObserved));
  const rgb = hexToRgb(color.hexColor).join(",");
  const rgb2 = color.hexColorSecondary ? hexToRgb(color.hexColorSecondary).join(",") : rgb;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-subink text-sm flex items-center gap-1 hover:text-ink mb-3"
      >
        <ArrowLeft size={14} /> back
      </button>

      <div
        className={`glass-card glass-highlight ${color.isIridescent ? "iridescent" : ""} p-5 mb-6`}
        style={
          {
            "--card-rgb": rgb,
            "--card-rgb-2": rgb2,
          } as React.CSSProperties
        }
      >
        <div className="flex flex-col md:flex-row gap-5">
          <div
            className="md:w-1/2 aspect-square rounded-xl overflow-hidden flex items-center justify-center"
            style={{
              background: `linear-gradient(160deg, rgba(${rgb},0.4), rgba(${rgb2},0.6))`,
            }}
          >
            {owned[0]?.photoUrl ? (
              <img src={owned[0].photoUrl} alt={color.name} className="w-full h-full object-cover" />
            ) : (
              <HenSilhouette color={color.hexColor} className="w-3/4 h-3/4" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start gap-2 flex-wrap">
              <h1 className="font-serif text-3xl md:text-4xl">{color.name}</h1>
              <RarityBadge rarity={color.rarity} />
              {color.isIridescent && <Badge tone="warn">Iridescent</Badge>}
            </div>
            <p className="text-subink mt-1">
              {color.productionStart}–{color.productionEnd} · {color.itemNumbers}
            </p>

            <dl className="grid grid-cols-2 gap-2 mt-4 text-sm">
              <Meta label="Nest type">{color.nestTypes}</Meta>
              <Meta label="Slotted beads">{color.hasSlottedBeads ? "variant exists" : "no"}</Meta>
              <Meta label="SSIN">{color.ssinReferences}</Meta>
              <Meta label="Rarity">{color.rarity}</Meta>
            </dl>

            <p className="mt-4 leading-relaxed">{color.description}</p>

            <div className="mt-4 flex gap-2 flex-wrap">
              <a
                href={ebaySearchUrl(color.ebaySearchQuery)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-gold font-semibold hover:underline"
              >
                Search eBay <ExternalLink size={13} />
              </a>
              <a
                href={ebaySearchUrl(color.ebaySearchQuery, true)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-gold font-semibold hover:underline"
              >
                Sold listings <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {owned.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-xl mb-3">In My Collection</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {owned.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 border border-[rgba(61,43,31,0.1)]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-subink">Acquired</div>
                    <div className="font-medium">{item.dateAcquired || "—"}</div>
                  </div>
                  {item.purchasePrice != null && (
                    <div className="text-right">
                      <div className="text-sm text-subink">Paid</div>
                      <div className="font-medium">${item.purchasePrice.toFixed(2)}</div>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.condition && <Badge tone="success">{item.condition}</Badge>}
                  {item.nestType && <Badge>{item.nestType}</Badge>}
                  {item.hasSlottedBeads && <Badge>slotted beads</Badge>}
                  {item.hasDecoration && <Badge tone="warn">decorated</Badge>}
                  {item.isFavorite && <Badge tone="warn">favorite</Badge>}
                </div>
                {item.purchaseSource && (
                  <p className="text-sm text-subink mt-2">from {item.purchaseSource}</p>
                )}
                {item.notes && <p className="mt-2 text-sm">{item.notes}</p>}
                {signedIn && (
                  <div className="mt-3">
                    <Link to={`/admin/edit/${item.id}`}>
                      <Button variant="ghost" size="sm">
                        <Pencil size={14} className="inline mr-1" /> Edit
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {colorPrices.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-xl mb-3">Price History</h2>
          <div className="bg-white rounded-xl p-4 border border-[rgba(61,43,31,0.1)]">
            <PriceChart prices={colorPrices} strokeColor={color.hexColor} />
          </div>
        </section>
      )}

      <BeadedBorder className="my-8" />

      <nav className="flex items-center justify-between">
        <Link to={`/hen/${prev.slug}`} className="text-sm flex items-center gap-1 hover:text-gold">
          <ArrowLeft size={14} /> {prev.name}
        </Link>
        <Link to={`/hen/${next.slug}`} className="text-sm flex items-center gap-1 hover:text-gold">
          {next.name} <ArrowRight size={14} />
        </Link>
      </nav>
    </div>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-subink">{label}</dt>
      <dd className="font-medium capitalize">{children}</dd>
    </div>
  );
}
