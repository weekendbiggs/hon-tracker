import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearToken, startOAuthFlow } from "@/auth/oauth";
import { useAdmin } from "@/hooks/useAdmin";
import { useCollection } from "@/hooks/useCollection";
import { validateConnection } from "@/api/github";
import Button from "@/components/ui/Button";
import { colorById } from "@/data/colors";
import {
  Plus,
  LineChart,
  LogOut,
  XCircle,
  Github,
} from "lucide-react";

export default function Admin() {
  const { signedIn } = useAdmin();
  const { items } = useCollection();
  const navigate = useNavigate();
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [busy, setBusy] = useState(false);

  // Pick up any OAuth error stashed by main.tsx during the callback
  useEffect(() => {
    const err = sessionStorage.getItem("hon:oauth-error");
    if (err) {
      setStatus({ ok: false, msg: err });
      sessionStorage.removeItem("hon:oauth-error");
    }
  }, []);

  // After signing in, validate the connection and show the GitHub username
  useEffect(() => {
    if (signedIn && !status) {
      (async () => {
        const r = await validateConnection();
        if (r.ok) setStatus({ ok: true, msg: `Signed in as ${r.login}.` });
        else {
          setStatus({ ok: false, msg: r.error ?? "Connection issue." });
          clearToken();
        }
      })();
    }
  }, [signedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  function signOut() {
    clearToken();
    setStatus(null);
    navigate("/admin");
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

  /* ── Signed-out view ─────────────────────────────────────────────── */

  if (!signedIn) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <h1 className="font-serif text-3xl mb-2">Admin</h1>
        <p className="text-subink mb-6 text-sm">
          Sign in with your GitHub account to manage the collection.
        </p>

        <Button size="lg" onClick={startOAuthFlow}>
          <Github size={18} className="inline mr-2" />
          Sign in with GitHub
        </Button>

        {status && !status.ok && (
          <div className="mt-4 text-sm text-[#9B1B30] flex items-center justify-center gap-1">
            <XCircle size={16} /> {status.msg}
          </div>
        )}
      </div>
    );
  }

  /* ── Signed-in dashboard ─────────────────────────────────────────── */

  const total = items.reduce((s, i) => s + (i.purchasePrice ?? 0), 0);
  const latest = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="font-serif text-3xl">Admin</h1>
          <p className="text-subink text-sm">
            {status?.ok ? status.msg : "Signed in"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Button variant="secondary" size="sm" onClick={testConnection} disabled={busy}>
            Test
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut size={14} className="inline mr-1" /> Sign out
          </Button>
        </div>
      </div>

      {status && !status.ok && (
        <div className="mb-4 text-sm flex items-center gap-1.5 text-[#9B1B30]">
          <XCircle size={16} /> {status.msg}
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
