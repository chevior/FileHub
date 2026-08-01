type StorageCardProps = {
  usedBytes: number;
  totalBytes?: number;
  fileCount: number;
  favoriteCount: number;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes;
  let index = -1;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
}

export default function StorageCard({
  usedBytes,
  totalBytes = 2 * 1024 * 1024 * 1024,
  fileCount,
  favoriteCount,
}: StorageCardProps) {
  const percent = Math.min(100, Math.round((usedBytes / totalBytes) * 100));

  return (
    <section className="glass-panel rounded-2xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)]">Storage</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {formatSize(usedBytes)} used of {formatSize(totalBytes)}
          </p>
        </div>
        <div className="text-right text-xs text-[var(--muted)]">
          <div>{fileCount} files</div>
          <div>{favoriteCount} favorites</div>
        </div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-[var(--stroke)]">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-sky-400"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-[var(--muted)]">{percent}% used</div>
    </section>
  );
}
