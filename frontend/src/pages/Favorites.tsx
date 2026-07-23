import { FiHeart, FiStar } from "react-icons/fi";
import AppShell from "../components/AppShell";
import { GlassCard } from "../components/ui";

const favorites = [
  { name: "Brand refresh", type: "Presentation", note: "Pinned for quick review" },
  { name: "Client notes", type: "Document", note: "Shared last Friday" },
  { name: "Sprint board", type: "Board", note: "Ready for the next sync" },
];

export default function Favorites() {
  return (
    <AppShell
      title="Favorites"
      subtitle="Keep your most important files one click away with a cleaner, more deliberate glance."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {favorites.map((item) => (
          <GlassCard key={item.name} className="rounded-[24px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-[var(--text)]">{item.name}</div>
                <div className="mt-1 text-sm text-[var(--muted)]">{item.type}</div>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--soft)] text-pink-400">
                <FiHeart size={18} />
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-[var(--soft)] px-4 py-3 text-sm text-[var(--muted)]">{item.note}</div>
            <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--soft)] px-3 py-2 text-xs font-semibold text-[var(--text)]">
              <FiStar size={14} />
              Keep highlighted
            </button>
          </GlassCard>
        ))}
      </section>
    </AppShell>
  );
}
