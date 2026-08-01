import axios from "axios";
import { useEffect, useState } from "react";
import FileCard from "../components/FileCard";
import StorageCard from "../components/StorageCard";
import UploadModal from "../components/UploadModal";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  downloadFile,
  getDashboard,
  moveToTrash,
  shareFile,
  toggleFavorite,
  uploadFile,
} from "../services/file.service";
import type { DashboardResponse, FileItem } from "../types/file";

function toMessage(error: unknown) {
  if (axios.isAxiosError<{ detail?: string }>(error)) {
    return error.response?.data?.detail ?? "Request failed.";
  }
  return "Something went wrong.";
}

export default function Files() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [data, setData] = useState<DashboardResponse | null>(null);

  const loadData = async (term = search) => {
    setLoading(true);
    setError("");
    try {
      const response = await getDashboard({ view: "files", search: term });
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

  const onShare = async (file: FileItem) => {
    const response = await shareFile(file.id);
    const shareUrl = `${window.location.origin}${response.data.path}`;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      setNotice("Share link copied to clipboard.");
    } else {
      setNotice(shareUrl);
    }
  };

  const onUpload = async (selectedFile: File, folderId?: number) => {
    setUploading(true);
    setError("");
    try {
      await uploadFile(selectedFile, folderId);
      await loadData();
      setNotice("File uploaded successfully.");
    } catch (requestError) {
      setError(toMessage(requestError));
      throw requestError;
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <DashboardLayout
        title="My Files"
        subtitle="Browse, organize, and share your files."
        search={search}
        onSearchChange={setSearch}
        onUploadClick={() => setUploadOpen(true)}
        userName={user?.name}
        onLogout={logout}
      >
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        {notice ? (
          <div className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {notice}
          </div>
        ) : null}

        <StorageCard
          usedBytes={data?.metrics.used_bytes ?? 0}
          fileCount={data?.metrics.file_count ?? 0}
          favoriteCount={data?.metrics.favorite_count ?? 0}
        />

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="text-sm text-[var(--muted)]">Loading files...</div>
          ) : data?.files.length ? (
            data.files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                view="files"
                onDownload={(item) => {
                  void onDownload(item);
                }}
                onFavorite={async (item) => {
                  await toggleFavorite(item.id);
                  await loadData();
                }}
                onTrash={async (item) => {
                  await moveToTrash(item.id);
                  await loadData();
                }}
                onRestore={async () => undefined}
                onDelete={async () => undefined}
                onShare={onShare}
              />
            ))
          ) : (
            <div className="text-sm text-[var(--muted)]">No files found.</div>
          )}
        </div>
      </DashboardLayout>

      <UploadModal
        open={uploadOpen}
        folders={data?.folders ?? []}
        submitting={uploading}
        onClose={() => setUploadOpen(false)}
        onSubmit={onUpload}
      />
    </>
  );
}
