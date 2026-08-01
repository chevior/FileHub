export interface FileItem {
  id: number;
  user_id: number;
  folder_id: number | null;
  name: string;
  stored_name: string;
  content_type: string;
  size: number;
  is_favorite: boolean;
  is_trashed: boolean;
  created_at: string;
  updated_at: string;
  folder_name: string | null;
}

export interface FolderItem {
  id: number;
  name: string;
  created_at: string;
}

export interface FileMetrics {
  file_count: number;
  used_bytes: number;
  favorite_count: number;
  trash_count: number;
}

export interface DashboardResponse {
  files: FileItem[];
  folders: FolderItem[];
  metrics: FileMetrics;
}

export interface ShareLinkResponse {
  token: string;
  path: string;
}

export interface SharedFileDetails {
  name: string;
  size: number;
  content_type: string;
  owner_name: string;
  created_at: string;
}
