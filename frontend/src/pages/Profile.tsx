import { FiAward, FiMail, FiUser } from "react-icons/fi";
import AppShell from "../components/AppShell";
import { GlassCard } from "../components/ui";

export default function Profile() {
  return (
    <AppShell
      title="Profile"
      subtitle="Keep your identity, account details, and workspace status neatly organized."
    >
      <section className="grid gap-4 lg:grid-cols-[1fr_.9fr]">
        <GlassCard className="rounded-[24px]">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-400 text-xl font-semibold text-white">
              FH
            </div>
            <div>
              <div className="text-xl font-semibold text-[var(--text)]">FileHub User</div>
              <div className="mt-1 text-sm text-[var(--muted)]">Premium workspace member</div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-[var(--soft)] px-4 py-3 text-sm text-[var(--text)]">
              <FiUser size={16} />
              Admin access
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-[var(--soft)] px-4 py-3 text-sm text-[var(--text)]">
              <FiMail size={16} />
              hello@filehub.app
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-[var(--soft)] px-4 py-3 text-sm text-[var(--text)]">
              <FiAward size={16} />
              Workspace plan: Pro
            </div>
          </div>
        </GlassCard>

        <GlassCard className="rounded-[24px]">
          <div className="text-base font-semibold text-[var(--text)]">Account status</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["Storage", "17 GB plan"],
              ["Status", "All synced"],
              ["Team", "3 collaborators"],
              ["Security", "2FA enabled"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-[var(--soft)] px-4 py-3">
                <div className="text-xs text-[var(--muted)]">{label}</div>
                <div className="mt-1 text-sm font-semibold text-[var(--text)]">{value}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </AppShell>
  );
}
