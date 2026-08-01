import axios from "axios";
import { useEffect, useState } from "react";
import { FiDownload, FiFileText, FiUser } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { downloadSharedFile, getSharedFileDetails } from "../services/file.service";
import type { SharedFileDetails } from "../types/file";

function toMessage(error: unknown) {
  if (axios.isAxiosError<{ detail?: string }>(error)) {
    return error.response?.data?.detail ?? "Request failed.";
  }
  return "Something went wrong.";
}

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

export default function SharedFile() {
  const { token = "" } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [details, setDetails] = useState<SharedFileDetails | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getSharedFileDetails(token);
        setDetails(response.data);
      } catch (requestError) {
        setError(toMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      void load();
    } else {
      setError("Invalid share link.");
      setLoading(false);
    }
  }, [token]);

  const handleDownload = async () => {
    const response = await downloadSharedFile(token);
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = details?.name ?? "shared-file";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg)] p-4 text-[var(--text)]">
      <section className="glass-panel w-full max-w-md rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">Shared File</h1>

        {loading ? <p className="mt-4 text-sm text-[var(--muted)]">Loading...</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

        {details ? (
          <div className="mt-5 space-y-3">
            <div className="rounded-xl bg-[var(--soft)] p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
                <FiFileText size={15} /> {details.name}
              </div>
              <div className="mt-1 text-xs text-[var(--muted)]">{formatSize(details.size)}</div>
            </div>

            <div className="rounded-xl bg-[var(--soft)] p-3 text-sm text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <FiUser size={14} /> Shared by {details.owner_name}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                void handleDownload();
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-sky-400 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <FiDownload size={15} /> Download
            </button>
          </div>
        ) : null}

        <div className="mt-5 text-center text-sm text-[var(--muted)]">
          <Link to="/" className="font-semibold text-violet-300">Back to FileHub</Link>
        </div>
      </section>
    </main>
  );
}
