export interface IFileShareEntity {
  id: string;
  fileId: string;
  token: string;
  password: string | null;
  allowedIps: string[];
  maxDownloads: number | null;
  downloads: number;
  maxViews: number | null;
  views: number;
  allowDownload: boolean;
  allowPreview: boolean;
  expiresAt: Date | null;
  name: string | null;
  description: string | null;
  createdBy: string;
  lastAccessAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateFileShareInput {
  fileId: string;
  token: string;
  password?: string | null;
  allowedIps?: string[];
  maxDownloads?: number | null;
  maxViews?: number | null;
  allowDownload?: boolean;
  allowPreview?: boolean;
  expiresAt?: Date | null;
  name?: string | null;
  description?: string | null;
  createdBy: string;
}
