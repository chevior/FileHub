import { useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import type { FolderItem } from "../types/file";
import toast from "react-hot-toast";

type UploadModalProps = {
  open: boolean;
  folders: FolderItem[];
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (file: File, folderId?: number) => Promise<void>;
};

export default function UploadModal({
  open,
  folders,
  submitting = false,
  onClose,
  onSubmit,
}: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [folderId, setFolderId] = useState<string>("");
  const [error, setError] = useState("");

  if (!open) return null;

  const submit = async () => {
  if (!selectedFile) {
    setError("Please choose a file to upload.");
    toast.error("Please choose a file first.");
    return;
  }

  try {
    setError("");

    await onSubmit(
      selectedFile,
      folderId ? Number(folderId) : undefined
    );

    toast.success(`${selectedFile.name} uploaded successfully`);

    setSelectedFile(null);
    setFolderId("");
    onClose();

  } catch (error) {
    toast.error("Upload failed. Please try again.");
  }
};

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" role="dialog" aria-modal="true">
      <div className="glass-panel w-full max-w-md rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">Upload file</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--soft)] text-[var(--muted)]"
          >
            <FiX size={15} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block text-sm text-[var(--muted)]">
            File
            <input
              type="file"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              className="mt-1 block w-full rounded-xl border border-[var(--stroke)] bg-[var(--soft)] p-2 text-sm"
            />
          </label>

          <label className="block text-sm text-[var(--muted)]">
            Folder (optional)
            <select
              value={folderId}
              onChange={(event) => setFolderId(event.target.value)}
              className="mt-1 block w-full rounded-xl border border-[var(--stroke)] bg-[var(--soft)] p-2 text-sm"
            >
              <option value="">No folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--stroke)] bg-[var(--soft)] px-4 py-2 text-sm text-[var(--text)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              void submit();
            }}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-sky-400 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            <FiUploadCloud size={15} />
            {submitting ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
