import { FiLogOut, FiSearch, FiUpload, FiUser } from "react-icons/fi";

type HeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  userName?: string;
  onUploadClick?: () => void;
  onLogout?: () => void;
};

export default function Header({
  search,
  onSearchChange,
  userName,
  onUploadClick,
  onLogout,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--stroke)] bg-[color:var(--panel)]/95 px-4 py-3 backdrop-blur-xl sm:px-5 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xl">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search your files"
            className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--soft)] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-violet-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {onUploadClick ? (
            <button
              type="button"
              onClick={onUploadClick}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-sky-400 px-3.5 py-2 text-sm font-semibold text-white"
            >
              <FiUpload size={15} /> Upload
            </button>
          ) : null}

          <div className="hidden items-center gap-2 rounded-xl border border-[var(--stroke)] bg-[var(--soft)] px-3 py-2 sm:flex">
            <FiUser size={14} className="text-[var(--muted)]" />
            <span className="text-sm font-medium text-[var(--text)]">{userName ?? "Profile"}</span>
          </div>

          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--stroke)] bg-[var(--soft)] px-3 py-2 text-sm font-medium text-[var(--text)]"
            >
              <FiLogOut size={14} /> Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
