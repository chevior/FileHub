import type { ReactNode } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type DashboardLayoutProps = {
  title: string;
  subtitle: string;
  search: string;
  onSearchChange: (value: string) => void;
  onUploadClick?: () => void;
  userName?: string;
  onLogout?: () => void;
  children: ReactNode;
};

export default function DashboardLayout({
  title,
  subtitle,
  search,
  onSearchChange,
  onUploadClick,
  userName,
  onLogout,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto flex max-w-[1500px] gap-3 p-3 lg:p-4">
        <Sidebar />

        <main className="glass-panel flex-1 rounded-[26px]">
          <Header
            search={search}
            onSearchChange={onSearchChange}
            userName={userName}
            onUploadClick={onUploadClick}
            onLogout={onLogout}
          />

          <section className="px-4 py-5 sm:px-5 lg:px-6">
            <div className="mb-5 rounded-2xl border border-[var(--stroke)] bg-[var(--soft)] p-4">
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">{title}</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
            </div>

            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
