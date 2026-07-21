import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import axios, { type AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FiArchive, FiDownload, FiFile, FiFolder, FiGrid, FiHardDrive,
  FiHeart, FiLink, FiLogOut, FiMenu, FiPlus, FiRefreshCw, FiSearch,
  FiShield, FiTrash2, FiUploadCloud, FiUser, FiX,
} from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type User = { id: number; name: string; email: string };
type Folder = { id: number; name: string; created_at: string };
type CloudFile = {
  id: number; name: string; content_type: string; size: number;
  is_favorite: boolean; is_trashed: boolean; folder_id: number | null;
  folder_name: string | null; created_at: string;
};
type DashboardData = {
  files: CloudFile[]; folders: Folder[];
  metrics: { file_count: number; used_bytes: number; favorite_count: number; trash_count: number };
};
type View = "files" | "favorites" | "trash";

const emptyDashboard: DashboardData = {
  files: [], folders: [], metrics: { file_count: 0, used_bytes: 0, favorite_count: 0, trash_count: 0 },
};

function storedToken() {
  try {
    return localStorage.getItem("filehub_token") || "";
  } catch {
    return "";
  }
}

function storedUser(): User | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem("filehub_user") || "null");
    if (
      typeof value === "object" && value !== null &&
      typeof (value as User).id === "number" &&
      typeof (value as User).name === "string" &&
      typeof (value as User).email === "string"
    ) return value as User;
  } catch {
    // Invalid or unavailable browser storage should behave like a signed-out session.
  }
  return null;
}

function errorMessage(error: unknown) {
  const response = (error as AxiosError<{ detail?: string }>).response;
  return response?.data?.detail || "Something went wrong. Please try again.";
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function AuthScreen({ onAuthenticated }: { onAuthenticated: (token: string, user: User) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/auth/${mode}`, values);
      onAuthenticated(data.token, data.user);
      toast.success(mode === "login" ? "Welcome back" : "Your FileHub is ready");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return <main className="auth-shell">
    <section className="auth-story">
      <a className="brand" href="#"><span><FiHardDrive /></span>FileHub</a>
      <div>
        <span className="eyebrow">Private by design · simple by default</span>
        <h1>Your files, organized and available when you need them.</h1>
        <p>Upload, organize, favorite, share, and recover your important files from one focused workspace.</p>
        <div className="trust-row"><span><FiShield /> Secure sessions</span><span><FiArchive /> Easy recovery</span></div>
      </div>
      <small>Personal cloud storage built with FastAPI and React.</small>
    </section>
    <section className="auth-panel">
      <form className="auth-card" onSubmit={submit}>
        <div className="mobile-brand"><span><FiHardDrive /></span> FileHub</div>
        <span className="eyebrow">{mode === "login" ? "Welcome back" : "Start organizing"}</span>
        <h2>{mode === "login" ? "Sign in to FileHub" : "Create your account"}</h2>
        <p>{mode === "login" ? "Continue to your private workspace." : "Set up your personal cloud in a minute."}</p>
        {mode === "register" && <label>Full name<input name="name" minLength={2} required placeholder="Chethan N" /></label>}
        <label>Email address<input name="email" type="email" required placeholder="you@example.com" /></label>
        <label>Password<input name="password" type="password" minLength={8} required placeholder="At least 8 characters" /></label>
        <button className="primary wide" disabled={loading}>{loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
        <button type="button" className="text-button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "New to FileHub? Create an account" : "Already have an account? Sign in"}
        </button>
      </form>
    </section>
  </main>;
}

function SharedScreen({ token }: { token: string }) {
  const [item, setItem] = useState<{ name: string; size: number; content_type: string; owner_name: string } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    axios.get(`${API}/api/shared/${token}`).then(({ data }) => setItem(data)).catch(() => setFailed(true));
  }, [token]);
  return <main className="shared-shell">
    <a className="brand" href={window.location.pathname}><span><FiHardDrive /></span>FileHub</a>
    <section className="shared-card">
      {failed ? <><div className="shared-icon"><FiX /></div><span className="eyebrow">Link unavailable</span><h1>This shared file cannot be found.</h1><p>The file may have been removed or moved to trash.</p></> : !item ? <><FiRefreshCw className="spin" /><h1>Opening shared file…</h1></> : <><div className="shared-icon"><FiFile /></div><span className="eyebrow">Shared by {item.owner_name}</span><h1>{item.name}</h1><p>{formatBytes(item.size)} · {item.content_type}</p><a className="primary share-download" href={`${API}/api/shared/${token}/download`}><FiDownload /> Download file</a></>}
    </section>
  </main>;
}

function App() {
  const shareToken = new URLSearchParams(window.location.search).get("share");
  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState<User | null>(storedUser);
  const [data, setData] = useState(emptyDashboard);
  const [view, setView] = useState<View>("files");
  const [folderId, setFolderId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const headers = { Authorization: `Bearer ${token}` };
  const loadDashboard = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data: result } = await axios.get(`${API}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { view, search: search || undefined, folder_id: folderId || undefined },
      });
      setData(result);
    } catch (error) {
      if ((error as AxiosError).response?.status === 401) logout();
      else toast.error(errorMessage(error));
    } finally { setLoading(false); }
  }, [token, view, search, folderId]);

  useEffect(() => { const timer = setTimeout(loadDashboard, 180); return () => clearTimeout(timer); }, [loadDashboard]);

  function authenticated(newToken: string, newUser: User) {
    localStorage.setItem("filehub_token", newToken);
    localStorage.setItem("filehub_user", JSON.stringify(newUser));
    setToken(newToken); setUser(newUser);
  }
  function logout() {
    localStorage.removeItem("filehub_token"); localStorage.removeItem("filehub_user");
    setToken(""); setUser(null); setData(emptyDashboard);
  }
  function navigate(next: View, folder: number | null = null) {
    setView(next); setFolderId(folder); setSearch(""); setMobileNav(false);
  }
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const body = new FormData(); body.append("upload", file);
        if (folderId) body.append("folder_id", String(folderId));
        await axios.post(`${API}/api/files/upload`, body, { headers });
      }
      toast.success(`${files.length} file${files.length > 1 ? "s" : ""} uploaded`);
      await loadDashboard();
    } catch (error) { toast.error(errorMessage(error)); }
    finally { setUploading(false); if (fileInput.current) fileInput.current.value = ""; }
  }
  async function createFolder() {
    const name = window.prompt("Folder name");
    if (!name?.trim()) return;
    try { await axios.post(`${API}/api/folders`, { name }, { headers }); toast.success("Folder created"); await loadDashboard(); }
    catch (error) { toast.error(errorMessage(error)); }
  }
  async function fileAction(file: CloudFile, action: "favorite" | "trash" | "restore" | "delete" | "share") {
    try {
      if (action === "delete") {
        if (!window.confirm(`Permanently delete ${file.name}?`)) return;
        await axios.delete(`${API}/api/files/${file.id}`, { headers });
      } else if (action === "share") {
        const { data: result } = await axios.post(`${API}/api/files/${file.id}/share`, {}, { headers });
        const link = `${window.location.origin}/?share=${result.token}`;
        await navigator.clipboard.writeText(link); toast.success("Share link copied"); return;
      } else await axios.patch(`${API}/api/files/${file.id}/${action}`, {}, { headers });
      toast.success(action === "favorite" ? "Favorite updated" : action === "restore" ? "File restored" : action === "trash" ? "Moved to trash" : "File deleted");
      await loadDashboard();
    } catch (error) { toast.error(errorMessage(error)); }
  }
  async function download(file: CloudFile) {
    try {
      const response = await axios.get(`${API}/api/files/${file.id}/download`, { headers, responseType: "blob" });
      const url = URL.createObjectURL(response.data); const anchor = document.createElement("a");
      anchor.href = url; anchor.download = file.name; anchor.click(); URL.revokeObjectURL(url);
    } catch (error) { toast.error(errorMessage(error)); }
  }

  if (shareToken) return <SharedScreen token={shareToken} />;
  if (!token || !user) return <><Toaster position="top-right" /><AuthScreen onAuthenticated={authenticated} /></>;

  const activeFolder = data.folders.find((folder) => folder.id === folderId);
  const title = activeFolder?.name || (view === "favorites" ? "Favorites" : view === "trash" ? "Trash" : "My files");
  return <div className="app-shell">
    <Toaster position="top-right" />
    <aside className={mobileNav ? "sidebar open" : "sidebar"}>
      <div className="sidebar-head"><a className="brand" href="#"><span><FiHardDrive /></span>FileHub</a><button className="icon-button mobile-only" onClick={() => setMobileNav(false)}><FiX /></button></div>
      <button className="primary upload" onClick={() => fileInput.current?.click()}><FiUploadCloud />{uploading ? "Uploading…" : "Upload files"}</button>
      <input ref={fileInput} hidden type="file" multiple onChange={(event) => upload(event.target.files)} />
      <nav>
        <button className={view === "files" && !folderId ? "active" : ""} onClick={() => navigate("files")}><FiGrid /> My files <span>{data.metrics.file_count}</span></button>
        <button className={view === "favorites" ? "active" : ""} onClick={() => navigate("favorites")}><FiHeart /> Favorites <span>{data.metrics.favorite_count || 0}</span></button>
        <button className={view === "trash" ? "active" : ""} onClick={() => navigate("trash")}><FiTrash2 /> Trash <span>{data.metrics.trash_count || 0}</span></button>
      </nav>
      <div className="folder-heading"><span>Folders</span><button onClick={createFolder}><FiPlus /></button></div>
      <nav className="folder-nav">{data.folders.map((folder) => <button key={folder.id} className={folderId === folder.id ? "active" : ""} onClick={() => navigate("files", folder.id)}><FiFolder />{folder.name}</button>)}</nav>
      <div className="storage-card"><div><span>Storage used</span><strong>{formatBytes(data.metrics.used_bytes)}</strong></div><div className="meter"><span style={{ width: `${Math.min(data.metrics.used_bytes / (1024 ** 3) * 100, 100)}%` }} /></div><small>1 GB personal workspace</small></div>
      <button className="profile-chip" onClick={logout}><span>{user.name.slice(0, 1).toUpperCase()}</span><div><strong>{user.name}</strong><small>{user.email}</small></div><FiLogOut /></button>
    </aside>
    <main className="workspace">
      <header><button className="icon-button mobile-only" onClick={() => setMobileNav(true)}><FiMenu /></button><div className="search"><FiSearch /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your files" /></div><button className="avatar"><FiUser /></button></header>
      <section className="content">
        <div className="content-head"><div><span className="eyebrow">Personal workspace</span><h1>{title}</h1><p>{data.files.length} item{data.files.length === 1 ? "" : "s"} · {formatBytes(data.metrics.used_bytes)} used</p></div><div className="header-actions"><button className="secondary" onClick={createFolder}><FiFolder /> New folder</button><button className="primary" onClick={() => fileInput.current?.click()}><FiUploadCloud /> Upload</button></div></div>
        {loading ? <div className="empty"><FiRefreshCw className="spin" /><h3>Loading your workspace</h3></div> : data.files.length ? <div className="file-grid">{data.files.map((file) => <article className="file-card" key={file.id}>
          <div className="file-icon"><FiFile /><button className={file.is_favorite ? "favorite selected" : "favorite"} onClick={() => fileAction(file, "favorite")}><FiHeart /></button></div>
          <h3 title={file.name}>{file.name}</h3><p>{file.folder_name || "My files"} · {formatBytes(file.size)}</p>
          <div className="file-actions">{file.is_trashed ? <><button onClick={() => fileAction(file, "restore")}><FiRefreshCw /> Restore</button><button className="danger" onClick={() => fileAction(file, "delete")}><FiTrash2 /></button></> : <><button onClick={() => download(file)}><FiDownload /> Download</button><button onClick={() => fileAction(file, "share")} title="Copy share link"><FiLink /></button><button onClick={() => fileAction(file, "trash")} title="Move to trash"><FiTrash2 /></button></>}</div>
        </article>)}</div> : <div className="empty"><span><FiUploadCloud /></span><h3>{search ? "No matching files" : view === "trash" ? "Trash is empty" : "Your workspace is ready"}</h3><p>{search ? "Try a different search term." : view === "trash" ? "Deleted files will appear here." : "Upload your first file or create a folder to get started."}</p>{view !== "trash" && !search && <button className="primary" onClick={() => fileInput.current?.click()}><FiUploadCloud /> Upload a file</button>}</div>}
      </section>
    </main>
  </div>;
}

export default App;
