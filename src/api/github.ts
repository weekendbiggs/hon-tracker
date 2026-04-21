import { CONFIG, dataPath } from "@/config";
import { getToken } from "@/auth/oauth";
import type { CollectionItem, PriceEntry } from "./types";

const API = "https://api.github.com";

function headers(): HeadersInit {
  const token = getToken();
  if (!token) throw new Error("Not signed in");
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
  };
}

function repoPath() {
  return `repos/${CONFIG.repoOwner}/${CONFIG.repoName}`;
}

async function getFile(path: string): Promise<{ content: string; sha: string } | null> {
  const res = await fetch(
    `${API}/${repoPath()}/contents/${encodeURIComponent(path)}?ref=${CONFIG.branch}`,
    { headers: headers(), cache: "no-store" },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const data = await res.json();
  return { content: data.content as string, sha: data.sha as string };
}

async function putFile(
  path: string,
  contentBase64: string,
  message: string,
  sha?: string,
): Promise<void> {
  const res = await fetch(`${API}/${repoPath()}/contents/${encodeURIComponent(path)}`, {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch: CONFIG.branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub write failed: ${res.status} ${body}`);
  }
}

function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function fromBase64(b64: string): string {
  const bin = atob(b64.replace(/\s/g, ""));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function readJsonFile<T>(path: string): Promise<{ data: T; sha: string | null }> {
  const f = await getFile(path);
  if (!f) return { data: [] as unknown as T, sha: null };
  return { data: JSON.parse(fromBase64(f.content)) as T, sha: f.sha };
}

async function writeJsonFile<T>(path: string, data: T, message: string, sha: string | null) {
  const json = JSON.stringify(data, null, 2) + "\n";
  await putFile(path, toBase64(json), message, sha ?? undefined);
}

export async function saveCollection(items: CollectionItem[], message: string) {
  const { sha } = await readJsonFile<CollectionItem[]>(dataPath.collection);
  await writeJsonFile(dataPath.collection, items, message, sha);
}

export async function savePrices(items: PriceEntry[], message: string) {
  const { sha } = await readJsonFile<PriceEntry[]>(dataPath.prices);
  await writeJsonFile(dataPath.prices, items, message, sha);
}

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunk)) as unknown as number[],
    );
  }
  return btoa(bin);
}

export async function uploadPhoto(file: File, slug: string): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${slug}-${Date.now()}.${ext}`;
  const path = `${dataPath.photosDir}/${name}`;
  const b64 = await fileToBase64(file);
  await putFile(path, b64, `Add photo ${name}`, undefined);
  const raw = `https://raw.githubusercontent.com/${CONFIG.repoOwner}/${CONFIG.repoName}/${CONFIG.branch}/${path}`;
  return raw;
}

export async function validateConnection(): Promise<{ ok: boolean; login?: string; error?: string }> {
  try {
    const res = await fetch(`${API}/user`, { headers: headers() });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const j = await res.json();
    const repoRes = await fetch(`${API}/${repoPath()}`, { headers: headers() });
    if (!repoRes.ok) return { ok: false, error: `Repo not reachable: ${repoRes.status}` };
    return { ok: true, login: j.login };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
