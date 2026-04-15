import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminGuard from "@/components/AdminGuard";
import { useCollection } from "@/hooks/useCollection";
import { HON_COLORS, colorById } from "@/data/colors";
import type { CollectionItem, Condition, DecorationCondition, NestType } from "@/api/types";
import Button from "@/components/ui/Button";
import { Input, Textarea, Select, Field } from "@/components/ui/Input";
import PhotoDrop from "@/components/PhotoDrop";
import { Trash2 } from "lucide-react";

const CONDITIONS: Condition[] = ["mint", "excellent", "good", "fair", "poor"];
const NEST_TYPES: NestType[] = ["stippled", "striated"];

function emptyItem(): CollectionItem {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    honColorId: HON_COLORS[0].id,
    dateAcquired: new Date().toISOString().slice(0, 10),
    purchasePrice: null,
    purchaseSource: "",
    condition: "excellent",
    nestType: "",
    hasSlottedBeads: false,
    hasDecoration: false,
    decorationCondition: "",
    photoUrl: "",
    notes: "",
    isFavorite: false,
    createdAt: new Date().toISOString(),
  };
}

export default function AdminAdd() {
  return (
    <AdminGuard>
      <AdminAddInner />
    </AdminGuard>
  );
}

function AdminAddInner() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, add, update, remove } = useCollection();
  const existing = useMemo(() => items.find((i) => i.id === id), [items, id]);
  const [form, setForm] = useState<CollectionItem>(existing ?? emptyItem());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existing) setForm(existing);
  }, [existing]);

  const selectedColor = colorById(form.honColorId);
  const isEdit = !!existing;

  function upd<K extends keyof CollectionItem>(key: K, value: CollectionItem[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEdit) await update(form);
      else await add(form);
      navigate(selectedColor ? `/hen/${selectedColor.slug}` : "/admin");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEdit) return;
    if (!confirm("Remove this HON from the collection?")) return;
    setSaving(true);
    try {
      await remove(form.id);
      navigate("/admin");
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">{isEdit ? "Edit HON" : "Add a HON"}</h1>
        <Link to="/admin" className="text-sm text-subink hover:text-ink">
          Cancel
        </Link>
      </div>

      <Field label="HON color">
        <Select
          value={form.honColorId}
          onChange={(e) => upd("honColorId", Number(e.target.value))}
        >
          {HON_COLORS.sort((a, b) => a.displayOrder - b.displayOrder).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.productionStart}–{c.productionEnd})
            </option>
          ))}
        </Select>
        {selectedColor && (
          <div
            className="mt-2 h-2 rounded"
            style={{ background: selectedColor.hexColor }}
            aria-hidden
          />
        )}
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Date acquired">
          <Input
            type="date"
            value={form.dateAcquired}
            onChange={(e) => upd("dateAcquired", e.target.value)}
          />
        </Field>
        <Field label="Purchase price (USD)">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.purchasePrice ?? ""}
            onChange={(e) =>
              upd("purchasePrice", e.target.value === "" ? null : Number(e.target.value))
            }
          />
        </Field>
      </div>

      <Field label="Where acquired">
        <Input
          placeholder="eBay, estate sale, antique shop…"
          value={form.purchaseSource}
          onChange={(e) => upd("purchaseSource", e.target.value)}
        />
      </Field>

      <Field label="Condition">
        <Segmented
          options={CONDITIONS}
          value={form.condition}
          onChange={(v) => upd("condition", v)}
        />
      </Field>

      <Field label="Nest type">
        <Segmented
          options={["", ...NEST_TYPES] as Array<"" | NestType>}
          labels={["unknown", "stippled", "striated"]}
          value={form.nestType}
          onChange={(v) => upd("nestType", v)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Toggle
          label="Slotted beads"
          checked={form.hasSlottedBeads}
          onChange={(v) => upd("hasSlottedBeads", v)}
        />
        <Toggle
          label="Has decoration (painted comb/wattle)"
          checked={form.hasDecoration}
          onChange={(v) => upd("hasDecoration", v)}
        />
      </div>

      {form.hasDecoration && (
        <Field label="Decoration condition">
          <Segmented
            options={["", "intact", "partial", "missing"] as DecorationCondition[]}
            labels={["—", "intact", "partial", "missing"]}
            value={form.decorationCondition}
            onChange={(v) => upd("decorationCondition", v)}
          />
        </Field>
      )}

      <Field label="Photo" hint="Drag-drop an image (uploaded to your repo), or paste a public URL.">
        <PhotoDrop
          slug={selectedColor?.slug ?? "hon"}
          value={form.photoUrl}
          onChange={(url) => upd("photoUrl", url)}
        />
      </Field>

      <Field label="Notes">
        <Textarea
          value={form.notes}
          onChange={(e) => upd("notes", e.target.value)}
          placeholder="Beautiful shimmer, slight rim chip on lid…"
        />
      </Field>

      <Toggle
        label="Pin as favorite (show first in gallery)"
        checked={form.isFavorite}
        onChange={(v) => upd("isFavorite", v)}
      />

      {error && (
        <div className="text-sm text-[#9B1B30] bg-[rgba(155,27,48,0.08)] rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          <Button type="submit" disabled={saving} size="lg">
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add to collection"}
          </Button>
          <Link to="/admin">
            <Button variant="ghost" size="lg" type="button">Cancel</Button>
          </Link>
        </div>
        {isEdit && (
          <Button type="button" variant="danger" onClick={handleDelete} disabled={saving}>
            <Trash2 size={14} className="inline mr-1" /> Delete
          </Button>
        )}
      </div>
    </form>
  );
}

function Segmented<T extends string>({
  options,
  labels,
  value,
  onChange,
}: {
  options: readonly T[];
  labels?: readonly string[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex bg-white rounded-lg p-1 border border-[rgba(61,43,31,0.15)] flex-wrap">
      {options.map((o, i) => (
        <button
          key={o + i}
          type="button"
          onClick={() => onChange(o)}
          className={`px-3 py-1.5 text-sm rounded-md capitalize transition-colors ${
            value === o ? "bg-ink text-warm" : "text-ink hover:bg-[rgba(61,43,31,0.05)]"
          }`}
        >
          {labels?.[i] ?? (o || "—")}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        className="h-4 w-4 accent-[#C8922A]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
