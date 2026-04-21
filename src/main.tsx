import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { handleOAuthCallback } from "@/auth/oauth";
import "./styles/index.css";
import "./styles/glass.css";

async function boot() {
  // Handle OAuth redirect — the ?code= param arrives in the real query string,
  // outside the hash, so we intercept it before React/HashRouter mounts.
  const result = await handleOAuthCallback();

  if (result.handled && !result.success && result.error) {
    sessionStorage.setItem("hon:oauth-error", result.error);
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

boot();
