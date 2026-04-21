import { useEffect, useState } from "react";
import { hasToken } from "@/auth/oauth";

export function useAdmin() {
  const [signedIn, setSignedIn] = useState<boolean>(hasToken());
  useEffect(() => {
    const on = () => setSignedIn(hasToken());
    window.addEventListener("hon:auth-changed", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("hon:auth-changed", on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return { signedIn };
}
