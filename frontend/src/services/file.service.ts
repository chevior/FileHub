import api from "./api";
import type {
  DashboardResponse,
  SharedFileDetails,
  ShareLinkResponse,
} from "../types/file";

export interface DashboardQuery {
  view?: "files" | "favorites" | "trash";
  search?: string;
  folder_id?: number;
}

export interface CreateFolderPayload {
  name: string;
}

export interface CreatedFolder {
  id: number;
  name: string;
}

export interface UploadFileResponse {
  id: number;
  name: string;
  size: number;
}

export const getDashboard = (params: DashboardQuery = {}) =>
  api.get<DashboardResponse>("/dashboard", { params });

export const createFolder = (payload: CreateFolderPayload) =>
  api.post<CreatedFolder>("/folders", payload);

export const uploadFile = (file: File, folderId?: number) => {
  const formData = new FormData();
  formData.append("upload", file);
  if (typeof folderId === "number") {
    formData.append("folder_id", String(folderId));
  }
  return api.post<UploadFileResponse>("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const downloadFile = (fileId: number) =>
  api.get<Blob>(`/files/${fileId}/download`, { responseType: "blob" });

export const toggleFavorite = (fileId: number) =>
  api.patch<{ is_favorite: boolean }>(`/files/${fileId}/favorite`);

export const moveToTrash = (fileId: number) =>
  api.patch<{ message: string }>(`/files/${fileId}/trash`);

export const restoreFromTrash = (fileId: number) =>
  api.patch<{ message: string }>(`/files/${fileId}/restore`);

export const deleteFilePermanently = (fileId: number) =>
  api.delete(`/files/${fileId}`);

export const shareFile = (fileId: number) =>
  api.post<ShareLinkResponse>(`/files/${fileId}/share`);

export const getSharedFileDetails = (token: string) =>
  api.get<SharedFileDetails>(`/shared/${token}`);

export const downloadSharedFile = (token: string) =>
  api.get<Blob>(`/shared/${token}/download`, { responseType: "blob" });
