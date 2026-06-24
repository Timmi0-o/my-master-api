import type {
  FileAccessLevel,
  FilePurpose,
  FileStatus,
  FileType,
} from 'src/modules/files/domain/entities/file';

export interface IUpdateFilePayload {
  folderId?: string | null;
  fileName?: string;
  originalName?: string;
  mimeType?: string;
  fileSize?: number;
  checksum?: string | null;
  status?: FileStatus;
  fileType?: FileType;
  accessLevel?: FileAccessLevel;
  purpose?: FilePurpose;
  metadata?: Record<string, unknown> | null;
  tags?: string[];
}
