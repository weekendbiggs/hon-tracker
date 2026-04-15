import { useState } from "react";
import { Link } from "react-router-dom";
import { clearPat, getPat, setPat } from "@/auth/pat";
import { useAdmin } from "@/hooks/useAdmin";
import { useCollection } from "@/hooks/useCollection";
import { validateConnection } from "@/api/github";
import Button from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { CONFIG } from "@/config";
import { colorById } from "@/data/colors";
import { Plus, LineChart, LogOut, CheckCircle2, XCircle } from "lucide-react";

export default function Admin() {
  const { signedIn } = useAdmin();
  const { items } = useCollection();
  const [pat, setPatInput] = useState("");
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [busy, setBusy] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (!pat.trim()) return;
    setBusy(true);
    setPat(pat.trim());
    const result = await validateConnection();
    if (result.ok) {
      setStatus({ ok: true, msg: `Signed in as ${result.login}. Welcome.` });
    } else {
      setStatus({ ok: false, msg: result.error ?? "Unknown error" });
      clearPat();
    }
    setBusy(false);
  }

  async function signOut() {
    clearPat();
    setStatus(null);
    setPatInput("");
  }

  async function testConnection() {
    setBusy(true);
    const result = await validateConnection();
    setStatus(
      result.ok
        ? { ok: true, msg: `Connected as ${result.login}.` }
        : { ok: false, msg: result.error ?? "Unknown error" },
    );
    setBusy(false);
  }

  if (!signedIn) {
    const patUrl = `https://github.com/settings/personal-access-tokens/new?target_name=${CONFIG.repoOwner}&repository_names=${CONFIG.repoName}&contents=write&metadata=read&description=HON+Tracker`;
    return (
      <div className="max-w-lg mx-auto">
        <h1 className="font-serif text-3xl mb-1">Sign in</h1>
        <p className="text-subink mb-5 text-sm">
          The admin area uses a GitHub Personal Access Token to save changes directly
          to your repo. You only need to do this once per browser.
        </p>

        <ol className="list-decimal list-inside space-y-2 text-sm mb-5 bg-white rounded-xl p-4 border border-[rgba(61,43,31,0.1)]">
          <li>
            <a
              href={patUrl}
              target="_blank"
              rel="noreferrer"
              className="text-gold font-semibold underline"
            >
              Create a fine-grained PAT
            </a>{" "}
            (the link pre-fills the right repo and permissions).
          </li>
          <li>
            Under <b>Repository access</b>, pick only <code>{CONFIG.repoName}</code>.
          </li>
          <li>
            Under <b>Repository permissions</b>, set <b>Contents</b> to{" "}
            <b>Read and write</b> and <b>Metadata</b> to <b>Read-only</b>.
          </li>
          <li>Generate the token, copy it, paste below.</li>
        </ol>

        <form onSubmit={signIn} className="space-y-3">
          <Field label="Personal access token" hint="Stored only in your browser's localStorage.">
            <Input
              type="password"
              placeholder="github_pat_…"
              value={pat}
              onChange={(e) => setPatInput(e.target.value)}
              autoComplete="off"
            />
          </Field>
          <Button type="submit" disabled={busy || !pat.trim()} size="lg">
            {busy ? "Checking…" : "Sign in"}
          </Button>
        </form>

        {status && !status.ok && (
          <div className="mt-3 text-sm text-[#9B1B30] flex items-start gap-1">
            <XCircle size={16} className="mt-0.5 shrink-0" /> {status.msg}
          </div>
        )}

        <p className="text-xs text-subink mt-6">
          Repo: <code>{CONFIG.repoOwner}/{CONFIG.repoName}</code>. Edit{" "}
          <code>src/config.ts</code> if this is wrong.
        </p>
      </div>
    );
  }

  const total = items.reduce((s, i) => s + (i.purchasePrice ?? 0), 0);
  const latest = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const pat4 = getPat()?.slice(-4) ?? "";

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="font-serif text-3xl">Admin</h1>
          <p className="text-subink text-sm">
            Signed in · token …{pat4}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={testConnection} disabled={busy}>
            Test connection
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut size={14} className="inline mr-1" /> Sign out
          </Button>
        </div>
      </div>

      {status && (
        <div
          className={`mb-4 text-sm flex items-center gap-1.5 ${
            status.ok ? "text-success" : "text-[#9B1B30]"
          }`}
        >
          {status.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {status.msg}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Items" value={items.length} />
        <StatCard label="Colors" value={new Set(items.map((i) => i.honColorId)).size} />
        <StatCard label="Invested" value={`$${total.toFixed(0)}`} />
      </div>

      <div className="flex gap-2 mb-6">
        <Link to="/admin/add">
          <Button>
            <Plus size={16} className="inline mr-1" /> Add a HON
          </Button>
        </Link>
        <Link to="/admin/prices">
          <Button variant="secondary">
            <LineChart size={16} className="inline mr-1" /> Log a price
          </Button>
        </Link>
      </div>

      <h2 className="font-serif text-xl mb-2">Recent additions</h2>
      {latest.length === 0 ? (
        <p className="text-subink text-sm">No items yet. Add your first HON.</p>
      ) : (
        <ul className="divide-y divide-[rgba(61,43,31,0.08)] bg-white rounded-xl border border-[rgba(61,43,31,0.1)]">
          {latest.map((i) => {
            const c = colorById(i.honColorId);
            return (
              <li key={i.id} className="p-3 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-md shrink-0"
                  style={{ background: c?.hexColor ?? "#ccc" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{c?.name ?? "Unknown"}</div>
                  <div className="text-xs text-subink">
                    {i.dateAcquired || "undated"} · {i.condition}
                  </div>
                </div>
                <Link to={`/admin/edit/${i.id}`} className="text-sm text-gold hover:underline">
                  edit
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-[rgba(61,43,31,0.1)]">
      <div className="font-serif text-2xl">{value}</div>
      <div className="text-xs uppercase tracking-wide text-subink">{label}</div>
    </div>
  );
}
