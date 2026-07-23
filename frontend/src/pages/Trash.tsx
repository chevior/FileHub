import { FiRefreshCw, FiTrash2 } from "react-icons/fi";
import AppShell from "../components/AppShell";
import { GlassCard } from "../components/ui";

const deleted = [
  { name: "Old briefing", deleted: "Removed 4 days ago" },
  { name: "Archive notes", deleted: "Removed yesterday" },
  { name: "Draft concepts", deleted: "Removed 2 days ago" },
];

export default function Trash() {
  return (
    <AppShell
      title="Trash"
      subtitle="Recover or review deleted items from a focused, low-noise interface."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {deleted.map((item) => (
          <GlassCard key={item.name} className="rounded-[24px]">
            <div className="flex items-center justify-between gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--soft)] text-rose-400">
                <FiTrash2 size={18} />
              </div>
              <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[var(--soft)] px-3 py-2 text-xs font-semibold text-[var(--text)]">
                <FiRefreshCw size={14} /> Recover
              </button>
            </div>
            <div className="mt-4 text-lg font-semibold text-[var(--text)]">{item.name}</div>
            <div className="mt-1 text-sm text-[var(--muted)]">{item.deleted}</div>
          </GlassCard>
        ))}
      </section>
    </AppShell>
  );
}
