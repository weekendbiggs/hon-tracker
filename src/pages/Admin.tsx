import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { clearPat, decodeShareKey, encodeShareKey, getPat, setPat } from "@/auth/pat";
import { useAdmin } from "@/hooks/useAdmin";
import { useCollection } from "@/hooks/useCollection";
import { validateConnection } from "@/api/github";
import Button from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { CONFIG } from "@/config";
import { colorById } from "@/data/colors";
import {
  Plus,
  LineChart,
  LogOut,
  CheckCircle2,
  XCircle,
  Share2,
  Copy,
  KeyRound,
} from "lucide-react";

export default function Admin() {
  const { signedIn } = useAdmin();
  const { items } = useCollection();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [pat, setPatInput] = useState("");
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [busy, setBusy] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Accept a share link: ?k=<encoded pat>
  useEffect(() => {
    const k = params.get("k");
    if (!k || signedIn) return;
    const token = decodeShareKey(k);
    if (!token) {
      setStatus({ ok: false, msg: "That share link is not valid." });
      setParams({}, { replace: true });
      return;
    }
    setPat(token);
    (async () => {
      const r = await validateConnection();
      if (r.ok) setStatus({ ok: true, msg: `Welcome! Signed in as ${r.login}.` });
      else {
        setStatus({ ok: false, msg: r.error ?? "Share link didn't work." });
        clearPat();
      }
      setParams({}, { replace: true });
    })();
  }, [params, signedIn, setParams]);

  useEffect(() => {
    if (!signedIn) inputRef.current?.focus();
  }, [signedIn]);

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

  function signOut() {
    clearPat();
    setStatus(null);
    setPatInput("");
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

  function shareLink(): string {
    const token = getPat();
    if (!token) return "";
    const key = encodeShareKey(token);
    return `${window.location.origin}${window.location.pathname}#/admin?k=${key}`;
  }

  async function copyShare() {
    const url = shareLink();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  if (!signedIn) {
    const patUrl = `https://github.com/settings/personal-access-tokens/new?target_name=${CONFIG.repoOwner}&repository_names=${CONFIG.repoName}&contents=write&metadata=read&description=HON+Tracker`;
    return (
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <KeyRound size={22} className="text-gold" />
          <h1 className="font-serif text-3xl">Unlock the cabinet</h1>
        </div>
        <p className="text-subink mb-5 text-sm">
          Paste your access key below. It's saved in this browser, so you only do this once.
          If someone shared a sign-in link with you, just tap it — this form isn't needed.
        </p>

        <form onSubmit={signIn} className="space-y-3 bg-white rounded-xl p-4 border border-[rgba(61,43,31,0.1)]">
          <Field label="Access key" hint="Starts with github_pat_…">
            <Input
              ref={inputRef}
              type="password"
              placeholder="github_pat_…"
              value={pat}
              onChange={(e) => setPatInput(e.target.value)}
              autoComplete="off"
            />
          </Field>
          <Button type="submit" disabled={busy || !pat.trim()} size="lg">
            {busy ? "Checking…" : "Unlock"}
          </Button>
        </form>

        {status && !status.ok && (
          <div className="mt-3 text-sm text-[#9B1B30] flex items-start gap-1">
            <XCircle size={16} className="mt-0.5 shrink-0" /> {status.msg}
          </div>
        )}

        <details className="mt-6 text-sm">
          <summary className="cursor-pointer text-subink hover:text-ink">
            First time? How to get an access key
          </summary>
          <ol className="list-decimal list-inside space-y-2 mt-3 bg-white rounded-xl p-4 border border-[rgba(61,43,31,0.1)]">
            <li>
              <a
                href={patUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gold font-semibold underline"
              >
                Open GitHub's token page
              </a>{" "}
              (the repo and permissions are pre-filled).
            </li>
            <li>
              Under <b>Repository access</b>, pick only <code>{CONFIG.repoName}</code>.
            </li>
            <li>
              Under <b>Repository permissions</b>, set <b>Contents</b> to{" "}
              <b>Read and write</b> and <b>Metadata</b> to <b>Read-only</b>.
            </li>
            <li>Generate, copy the token, paste it above.</li>
          </ol>
          <p className="text-xs text-subink mt-3">
            Repo: <code>{CONFIG.repoOwner}/{CONFIG.repoName}</code>.
          </p>
        </details>
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
          <p className="text-subink text-sm">Signed in · key …{pat4}</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Button variant="secondary" size="sm" onClick={() => setShowShare((s) => !s)}>
            <Share2 size={14} className="inline mr-1" /> Share sign-in
          </Button>
          <Button variant="secondary" size="sm" onClick={testConnection} disabled={busy}>
            Test
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut size={14} className="inline mr-1" /> Sign out
          </Button>
        </div>
      </div>

      {showShare && (
        <div className="mb-4 bg-white rounded-xl p-4 border border-[rgba(61,43,31,0.1)]">
          <p className="text-sm mb-2">
            <b>Share this link privately</b> (text, AirDrop, email). Whoever opens it
            will be signed in on their device. Anyone with the link can edit the
            collection, so don't post it publicly.
          </p>
          <div className="flex gap-2">
            <Input readOnly value={shareLink()} onFocus={(e) => e.currentTarget.select()} />
            <Button size="sm" onClick={copyShare}>
              <Copy size={14} className="inline mr-1" /> {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      )}

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
