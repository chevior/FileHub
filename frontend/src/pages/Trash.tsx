import axios from "axios";
import { useEffect, useState } from "react";
import FileCard from "../components/FileCard";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  deleteFilePermanently,
  downloadFile,
  getDashboard,
  restoreFromTrash,
} from "../services/file.service";
import type { DashboardResponse, FileItem } from "../types/file";

function toMessage(error: unknown) {
  if (axios.isAxiosError<{ detail?: string }>(error)) {
    return error.response?.data?.detail ?? "Request failed.";
  }
  return "Something went wrong.";
}

export default function Trash() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<DashboardResponse | null>(null);

  const loadData = async (term = search) => {
    setLoading(true);
    setError("");
    try {
      const response = await getDashboard({ view: "trash", search: term });
      setData(response.data);
    } catch (requestError) {
      setError(toMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData("");
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData(search);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const onDownload = async (file: FileItem) => {
    const response = await downloadFile(file.id);
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout
      title="Trash"
      subtitle="Restore or permanently delete files from trash."
      search={search}
      onSearchChange={setSearch}
      userName={user?.name}
      onLogout={logout}
    >
      {error ? (
        <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="text-sm text-[var(--muted)]">Loading trash...</div>
        ) : data?.files.length ? (
          data.files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              view="trash"
              onDownload={(item) => {
                void onDownload(item);
              }}
              onFavorite={() => undefined}
              onTrash={() => undefined}
              onRestore={(item) => {
                void restoreFromTrash(item.id).then(() => loadData());
              }}
              onDelete={(item) => {
                void deleteFilePermanently(item.id).then(() => loadData());
              }}
              onShare={() => undefined}
            />
          ))
        ) : (
          <div className="text-sm text-[var(--muted)]">Trash is empty.</div>
        )}
      </div>
    </DashboardLayout>
  );
}
