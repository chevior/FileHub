import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--bg)] px-4 text-[var(--muted)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel flex w-full max-w-md flex-col items-center gap-4 rounded-[28px] p-8"
          role="status"
        >
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--stroke)] border-t-violet-400" />
          <div className="text-center">
            <div className="text-base font-semibold text-[var(--text)]">Restoring your workspace…</div>
            <div className="mt-1 text-sm">Loading your secure FileHub session.</div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace state={{ from: location }} />;
  return children;
}
