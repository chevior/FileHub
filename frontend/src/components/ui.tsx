import { motion } from "framer-motion";
import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`glass-panel rounded-[24px] p-4 sm:p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-panel rounded-[24px] p-4 sm:p-5">
      <div className="h-36 animate-pulse rounded-2xl bg-[var(--soft)]" />
      <div className="mt-4 h-4 w-2/3 animate-pulse rounded-full bg-[var(--soft)]" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-[var(--soft)]" />
    </div>
  );
}
