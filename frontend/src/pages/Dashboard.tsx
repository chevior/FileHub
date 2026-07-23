import { FiArrowUpRight, FiClock, FiFolder, FiLayers, FiShare2 } from "react-icons/fi";
import AppShell from "../components/AppShell";
import { GlassCard, SkeletonCard } from "../components/ui";

const metrics = [
  { label: "Files synced", value: "248", detail: "+12% this week", icon: FiFolder },
  { label: "Shared with team", value: "31", detail: "7 pending approvals", icon: FiShare2 },
  { label: "Active projects", value: "9", detail: "3 recently updated", icon: FiLayers },
];

export default function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="A calm, fast overview of your current activity and important daily signals."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map(({ label, value, detail, icon: Icon }) => (
          <GlassCard key={label} className="rounded-[24px]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[var(--muted)]">{label}</div>
                <div className="mt-2 text-3xl font-semibold text-[var(--text)]">{value}</div>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--soft)] text-violet-400">
                <Icon size={18} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300">
              <FiArrowUpRight size={14} />
              {detail}
            </div>
          </GlassCard>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <GlassCard className="rounded-[24px]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-base font-semibold text-[var(--text)]">Recent activity</div>
              <div className="mt-1 text-sm text-[var(--muted)]">An at-a-glance feed of recent file activity.</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <FiClock size={14} />
              Updated just now
            </div>
          </div>

          <div className="space-y-3">
            {[
              "Quarterly deck shared with leadership.",
              "Audit checklist finalized and tagged.",
              "New design file available for review.",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-[var(--soft)] px-4 py-3 text-sm text-[var(--text)]">
                {item}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="rounded-[24px]">
          <div className="text-base font-semibold text-[var(--text)]">Quick overview</div>
          <div className="mt-3 grid gap-3">
            {[
              ["Storage used", "72%"],
              ["Favorites", "18 ready"],
              ["Queue", "4 uploads in progress"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-[var(--soft)] px-4 py-3">
                <div className="text-xs text-[var(--muted)]">{label}</div>
                <div className="mt-1 text-sm font-semibold text-[var(--text)]">{value}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </section>
    </AppShell>
  );
}
