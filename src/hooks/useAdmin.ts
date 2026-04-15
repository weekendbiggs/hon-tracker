import { useEffect, useState } from "react";
import { hasPat } from "@/auth/pat";

export function useAdmin() {
  const [signedIn, setSignedIn] = useState<boolean>(hasPat());
  useEffect(() => {
    const on = () => setSignedIn(hasPat());
    window.addEventListener("hon:auth-changed", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("hon:auth-changed", on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return { signedIn };
}
