import type {
  FileAccessLevel,
  FileOwnerType,
  FilePurpose,
  FileType,
} from 'src/modules/files/domain/entities/file';
import type { IFileActorInput } from '../common/i-file-actor.input';

export interface IPresignedUploadFileItemInput {
  name: string;
  sha256sum?: string;
  folderId?: string | null;
  ownerType: FileOwnerType;
  ownerKind: string;
  ownerId: string;
  accessLevel: FileAccessLevel;
  purpose?: FilePurpose;
  fileType: FileType;
  uploadedBy?: string;
  tags?: string[];
}

export interface IPresignedUploadApplicationInput {
  files: IPresignedUploadFileItemInput[];
  userId?: string;
  actor: IFileActorInput;
}
