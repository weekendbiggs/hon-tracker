const TOKEN_KEY = "hon.token";
const OLD_KEY = "hon.pat";

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID ?? "";
const WORKER_URL = import.meta.env.VITE_OAUTH_WORKER_URL ?? "";

// One-time migration from the old PAT key
(() => {
  try {
    const old = localStorage.getItem(OLD_KEY);
    if (old && !localStorage.getItem(TOKEN_KEY)) {
      localStorage.setItem(TOKEN_KEY, old);
    }
    localStorage.removeItem(OLD_KEY);
  } catch { /* ignore */ }
})();

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token.trim());
  window.dispatchEvent(new Event("hon:auth-changed"));
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("hon:auth-changed"));
}

export function hasToken(): boolean {
  return !!getToken();
}

/** Redirect to GitHub's OAuth authorization page. */
export function startOAuthFlow(): void {
  const redirectUri = window.location.origin + window.location.pathname;
  const state = crypto.randomUUID();
  sessionStorage.setItem("hon:oauth-state", state);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "repo",
    state,
  });

  window.location.href = `https://github.com/login/oauth/authorize?${params}`;
}

/**
 * Called on app load before React mounts. Checks window.location.search for
 * ?code=&state= (GitHub puts these BEFORE the hash in a HashRouter app).
 * If found, exchanges the code for a token via the Cloudflare Worker.
 */
export async function handleOAuthCallback(): Promise<{
  handled: boolean;
  success?: boolean;
  error?: string;
}> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");

  if (!code) return { handled: false };

  // Verify CSRF state
  const expectedState = sessionStorage.getItem("hon:oauth-state");
  sessionStorage.removeItem("hon:oauth-state");
  if (state !== expectedState) {
    cleanCallbackParams();
    return { handled: true, success: false, error: "OAuth state mismatch — possible CSRF." };
  }

  try {
    const res = await fetch(`${WORKER_URL}/api/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();
    if (!res.ok || !data.access_token) {
      cleanCallbackParams();
      return { handled: true, success: false, error: data.error || "Token exchange failed." };
    }

    setToken(data.access_token);
    cleanCallbackParams();

    // Land on the admin page after sign-in
    if (!window.location.hash || window.location.hash === "#/") {
      window.location.hash = "#/admin";
    }

    return { handled: true, success: true };
  } catch (e) {
    cleanCallbackParams();
    return { handled: true, success: false, error: (e as Error).message };
  }
}

function cleanCallbackParams(): void {
  const url = new URL(window.location.href);
  url.search = "";
  window.history.replaceState(null, "", url.toString());
}
