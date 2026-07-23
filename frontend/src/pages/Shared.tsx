import { FiShare2 } from "react-icons/fi";
import AppShell from "../components/AppShell";
import { GlassCard } from "../components/ui";

const shared = [
  { name: "Launch brief", audience: "Leadership team", status: "Shared 3 hours ago" },
  { name: "Prototype assets", audience: "Design crew", status: "Shared today" },
  { name: "Roadmap snapshot", audience: "Engineering", status: "Shared yesterday" },
];

export default function Shared() {
  return (
    <AppShell
      title="Shared"
      subtitle="Every shared item is surfaced in a polished, scan-friendly panel layout."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shared.map((item) => (
          <GlassCard key={item.name} className="rounded-[24px]">
            <div className="flex items-center justify-between gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--soft)] text-violet-400">
                <FiShare2 size={18} />
              </div>
              <div className="rounded-full bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                Active
              </div>
            </div>
            <div className="mt-4 text-lg font-semibold text-[var(--text)]">{item.name}</div>
            <div className="mt-1 text-sm text-[var(--muted)]">{item.audience}</div>
            <div className="mt-4 rounded-2xl bg-[var(--soft)] px-4 py-3 text-sm text-[var(--muted)]">{item.status}</div>
          </GlassCard>
        ))}
      </section>
    </AppShell>
  );
}
