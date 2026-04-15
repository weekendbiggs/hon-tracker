import { Navigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { signedIn } = useAdmin();
  if (!signedIn) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}
