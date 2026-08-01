import { FiDownload, FiLink2, FiRotateCcw, FiStar, FiTrash2 } from "react-icons/fi";
import type { FileItem } from "../types/file";

type FileCardProps = {
	file: FileItem;
	view: "files" | "favorites" | "trash";
	onDownload: (file: FileItem) => void;
	onFavorite: (file: FileItem) => void;
	onTrash: (file: FileItem) => void;
	onRestore: (file: FileItem) => void;
	onDelete: (file: FileItem) => void;
	onShare: (file: FileItem) => void;
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

export default function FileCard({
	file,
	view,
	onDownload,
	onFavorite,
	onTrash,
	onRestore,
	onDelete,
	onShare,
}: FileCardProps) {
	return (
		<article className="glass-panel rounded-2xl p-4">
			<div className="flex items-start justify-between gap-3">
				<div>
					<h3 className="line-clamp-1 text-base font-semibold text-[var(--text)]">{file.name}</h3>
					<p className="mt-1 text-xs text-[var(--muted)]">{formatSize(file.size)}</p>
					<p className="mt-1 text-xs text-[var(--muted)]">{file.folder_name ?? "No folder"}</p>
				</div>

				{view !== "trash" ? (
					<button
						type="button"
						onClick={() => onFavorite(file)}
						className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--soft)] text-[var(--muted)] hover:text-yellow-400"
						title="Toggle favorite"
					>
						<FiStar size={15} className={file.is_favorite ? "text-yellow-400" : ""} />
					</button>
				) : null}
			</div>

			<div className="mt-4 flex flex-wrap gap-2">
				<button
					type="button"
					onClick={() => onDownload(file)}
					className="inline-flex items-center gap-2 rounded-xl border border-[var(--stroke)] bg-[var(--soft)] px-3 py-2 text-xs font-semibold text-[var(--text)]"
				>
					<FiDownload size={14} /> Download
				</button>

				{view === "trash" ? (
					<>
						<button
							type="button"
							onClick={() => onRestore(file)}
							className="inline-flex items-center gap-2 rounded-xl border border-[var(--stroke)] bg-[var(--soft)] px-3 py-2 text-xs font-semibold text-[var(--text)]"
						>
							<FiRotateCcw size={14} /> Restore
						</button>
						<button
							type="button"
							onClick={() => onDelete(file)}
							className="inline-flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300"
						>
							<FiTrash2 size={14} /> Delete
						</button>
					</>
				) : (
					<>
						<button
							type="button"
							onClick={() => onTrash(file)}
							className="inline-flex items-center gap-2 rounded-xl border border-[var(--stroke)] bg-[var(--soft)] px-3 py-2 text-xs font-semibold text-[var(--text)]"
						>
							<FiTrash2 size={14} /> Trash
						</button>
						<button
							type="button"
							onClick={() => onShare(file)}
							className="inline-flex items-center gap-2 rounded-xl border border-[var(--stroke)] bg-[var(--soft)] px-3 py-2 text-xs font-semibold text-[var(--text)]"
						>
							<FiLink2 size={14} /> Share
						</button>
					</>
				)}
			</div>
		</article>
	);
}

