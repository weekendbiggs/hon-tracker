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
