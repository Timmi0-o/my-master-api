export interface ICreateFileSharePayload {
  password?: string | null;
  allowedIps?: string[];
  maxDownloads?: number | null;
  maxViews?: number | null;
  allowDownload?: boolean;
  allowPreview?: boolean;
  expiresAt?: string | null;
  name?: string | null;
  description?: string | null;
}
