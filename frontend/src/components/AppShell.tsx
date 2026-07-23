import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FiFolder, FiGrid, FiHeart, FiHome, FiSearch, FiShare2, FiTrash2, FiUploadCloud, FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

type AppShellProps = {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
};

const navItems = [
  { to: "/dashboard", label: "Overview", icon: FiHome },
  { to: "/files", label: "My files", icon: FiFolder },
  { to: "/shared", label: "Shared", icon: FiShare2 },
  { to: "/favorites", label: "Favorites", icon: FiHeart },
  { to: "/trash", label: "Trash", icon: FiTrash2 },
  { to: "/profile", label: "Profile", icon: FiUser },
];

export default function AppShell({ title, subtitle, action, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto flex max-w-[1600px] gap-3 p-3 lg:p-4">
        <aside className="glass-panel hidden w-[280px] shrink-0 flex-col rounded-[28px] p-3 lg:flex">
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[var(--soft)] px-3 py-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 text-white shadow-lg shadow-violet-500/20">
              <FiFolder size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">FileHub</div>
              <div className="text-xs text-[var(--muted)]">Private workspace</div>
            </div>
          </div>

          <button type="button" className="mb-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-sky-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-transform hover:-translate-y-0.5">
            <FiUploadCloud size={16} />
            New upload
          </button>

          <nav className="space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[var(--soft)] text-[var(--text)] shadow-sm"
                      : "text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--text)]"
                  }`
                }
              >
                <Icon size={17} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-[22px] bg-[var(--soft)] p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-[var(--muted)]">
              <span>Storage</span>
              <span>72%</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--stroke)]">
              <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-violet-500 to-sky-400" />
            </div>
            <div className="mt-3 text-xs text-[var(--muted)]">12.4 GB of 17 GB used</div>
          </div>
        </aside>

        <main className="flex-1 rounded-[28px] border border-[var(--stroke)] bg-[var(--panel)] backdrop-blur-xl">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--stroke)] px-4 py-4 sm:px-5 lg:px-6">
            <div className="flex flex-1 items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--stroke)] bg-[var(--soft)] text-[var(--muted)] lg:hidden">
                <FiGrid size={18} />
              </div>
              <div className="relative w-full max-w-md">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="search"
                  placeholder="Search files and folders"
                  className="w-full rounded-2xl border border-[var(--stroke)] bg-[var(--soft)] py-2.5 pl-10 pr-3 text-sm text-[var(--text)] outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              {action}
            </div>
          </header>

          <div className="px-4 py-5 sm:px-5 lg:px-6">
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mb-5 flex flex-wrap items-end justify-between gap-4 rounded-[24px] bg-[var(--soft)] p-4 sm:p-5"
            >
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-violet-400">Workspace</div>
                <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">{title}</h1>
                <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
              </div>
              {action ? <div className="flex items-center gap-2">{action}</div> : null}
            </motion.section>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
