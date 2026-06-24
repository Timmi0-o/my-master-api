import type { IFileActorInput } from '../common/i-file-actor.input';

export interface ICreateFileShareApplicationInput {
  fileId: string;
  password?: string | null;
  allowedIps?: string[];
  maxDownloads?: number | null;
  maxViews?: number | null;
  allowDownload?: boolean;
  allowPreview?: boolean;
  expiresAt?: Date | null;
  name?: string | null;
  description?: string | null;
  actor: IFileActorInput;
}
