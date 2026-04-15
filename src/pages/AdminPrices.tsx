import { useState } from "react";
import { Link } from "react-router-dom";
import AdminGuard from "@/components/AdminGuard";
import { usePrices } from "@/hooks/usePrices";
import { HON_COLORS, colorById } from "@/data/colors";
import type { PriceEntry, PriceSource } from "@/api/types";
import Button from "@/components/ui/Button";
import { Input, Select, Field, Textarea } from "@/components/ui/Input";
import { Trash2 } from "lucide-react";

const SOURCES: PriceSource[] = [
  "ebay_active",
  "ebay_sold",
  "etsy",
  "antique_shop",
  "auction",
  "other",
];

function emptyEntry(): PriceEntry {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    honColorId: HON_COLORS[0].id,
    price: 0,
    source: "ebay_sold",
    condition: "",
    listingUrl: "",
    dateObserved: new Date().toISOString().slice(0, 10),
    notes: "",
    isAutomated: false,
    createdAt: new Date().toISOString(),
  };
}

export default function AdminPrices() {
  return (
    <AdminGuard>
      <AdminPricesInner />
    </AdminGuard>
  );
}

function AdminPricesInner() {
  const { items, add, remove } = usePrices();
  const [form, setForm] = useState<PriceEntry>(emptyEntry());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await add(form);
      setForm(emptyEntry());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function del(id: string) {
    if (!confirm("Remove this price entry?")) return;
    try {
      await remove(id);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const recent = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 15);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-serif text-3xl">Log a Price</h1>
        <Link to="/admin" className="text-sm text-subink hover:text-ink">Back to admin</Link>
      </div>

      <form onSubmit={submit} className="space-y-3 bg-white rounded-xl p-5 border border-[rgba(61,43,31,0.1)]">
        <Field label="HON color">
          <Select
            value={form.honColorId}
            onChange={(e) => setForm({ ...form, honColorId: Number(e.target.value) })}
          >
            {HON_COLORS.sort((a, b) => a.displayOrder - b.displayOrder).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (USD)">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              required
            />
          </Field>
          <Field label="Date observed">
            <Input
              type="date"
              value={form.dateObserved}
              onChange={(e) => setForm({ ...form, dateObserved: e.target.value })}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Source">
            <Select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value as PriceSource })}
            >
              {SOURCES.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </Select>
          </Field>
          <Field label="Condition (if known)">
            <Select
              value={form.condition}
              onChange={(e) =>
                setForm({ ...form, condition: e.target.value as PriceEntry["condition"] })
              }
            >
              <option value="">unknown</option>
              <option value="mint">mint</option>
              <option value="excellent">excellent</option>
              <option value="good">good</option>
              <option value="fair">fair</option>
              <option value="poor">poor</option>
            </Select>
          </Field>
        </div>

        <Field label="Listing URL (optional)">
          <Input
            type="url"
            value={form.listingUrl}
            onChange={(e) => setForm({ ...form, listingUrl: e.target.value })}
          />
        </Field>

        <Field label="Notes">
          <Textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </Field>

        {error && <div className="text-sm text-[#9B1B30]">{error}</div>}

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Log price"}
        </Button>
      </form>

      <h2 className="font-serif text-xl mt-8 mb-3">Recent entries</h2>
      {recent.length === 0 ? (
        <p className="text-subink text-sm">No price entries yet.</p>
      ) : (
        <ul className="divide-y divide-[rgba(61,43,31,0.08)] bg-white rounded-xl border border-[rgba(61,43,31,0.1)]">
          {recent.map((p) => {
            const c = colorById(p.honColorId);
            return (
              <li key={p.id} className="p-3 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded shrink-0"
                  style={{ background: c?.hexColor ?? "#ccc" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">
                    {c?.name} · ${p.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-subink">
                    {p.dateObserved} · {p.source.replace("_", " ")}
                    {p.condition && ` · ${p.condition}`}
                  </div>
                </div>
                <button
                  onClick={() => del(p.id)}
                  className="p-1.5 rounded hover:bg-[rgba(155,27,48,0.08)] text-[#9B1B30]"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
