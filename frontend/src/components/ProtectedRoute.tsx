import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="route-loader" role="status"><span className="loader" /><p>Restoring your workspace…</p></div>;
  if (!user) return <Navigate to="/" replace state={{ from: location }} />;
  return children;
}
