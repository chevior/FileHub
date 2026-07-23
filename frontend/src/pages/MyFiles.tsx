import { FiDownload, FiFileText, FiStar, FiTrash2 } from "react-icons/fi";
import AppShell from "../components/AppShell";
import { GlassCard } from "../components/ui";

const files = [
  { name: "Launch deck", type: "Presentation", meta: "Updated 2h ago" },
  { name: "Team handbook", type: "Document", meta: "Updated yesterday" },
  { name: "Revenue model", type: "Spreadsheet", meta: "Updated 4 days ago" },
  { name: "Quarterly notes", type: "Doc", meta: "Updated 1 week ago" },
  { name: "Design system", type: "Folder", meta: "24 assets" },
  { name: "Roadmap", type: "Board", meta: "Last edited today" },
];

export default function MyFiles() {
  return (
    <AppShell
      title="My files"
      subtitle="Browse your latest workspace assets with a cleaner, easier-to-scan layout."
      action={
        <button type="button" className="rounded-2xl bg-[var(--soft)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--soft)]">
          Upload new
        </button>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {files.map((file) => (
          <GlassCard key={file.name} className="rounded-[24px]">
            <div className="flex items-start justify-between gap-2">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--soft)] text-violet-400">
                <FiFileText size={22} />
              </div>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--soft)] text-[var(--muted)] hover:text-violet-400">
                <FiStar size={16} />
              </button>
            </div>
            <div className="mt-4 text-lg font-semibold text-[var(--text)]">{file.name}</div>
            <div className="mt-1 text-sm text-[var(--muted)]">{file.type}</div>
            <div className="mt-3 text-xs text-[var(--muted)]">{file.meta}</div>
            <div className="mt-4 flex gap-2">
              <button type="button" className="flex-1 rounded-xl bg-[var(--soft)] px-3 py-2 text-xs font-semibold text-[var(--text)]">Open</button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--soft)] text-[var(--muted)] hover:text-violet-400">
                <FiDownload size={16} />
              </button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--soft)] text-[var(--muted)] hover:text-rose-400">
                <FiTrash2 size={16} />
              </button>
            </div>
          </GlassCard>
        ))}
      </section>
    </AppShell>
  );
}
