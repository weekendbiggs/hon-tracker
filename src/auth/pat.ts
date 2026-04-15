const KEY = "hon.pat";

export function getPat(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setPat(pat: string): void {
  localStorage.setItem(KEY, pat.trim());
  window.dispatchEvent(new Event("hon:auth-changed"));
}

export function clearPat(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("hon:auth-changed"));
}

export function hasPat(): boolean {
  return !!getPat();
}

/** Lightweight obfuscation — not real encryption. Just keeps the raw PAT out of
 *  casual clipboard-peeking when a share link gets pasted somewhere. */
export function encodeShareKey(pat: string): string {
  const bytes = new TextEncoder().encode(pat);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b ^ 0x5a);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeShareKey(key: string): string | null {
  try {
    const b64 = key.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i) ^ 0x5a;
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}
