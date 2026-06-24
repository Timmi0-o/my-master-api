import {
  FileAccessLevel,
  FileOwnerType,
  FilePurpose,
  FileType,
} from 'src/modules/files/domain/entities/file';

export const MASTER_SERVICE_IMAGE_OWNER_KIND = 'master-service' as const;

export const MASTER_SERVICE_IMAGE_FILE_DEFAULTS = {
  ownerKind: MASTER_SERVICE_IMAGE_OWNER_KIND,
  ownerType: FileOwnerType.USER,
  accessLevel: FileAccessLevel.PUBLIC,
  purpose: FilePurpose.MASTER_SERVICE_IMAGE,
  fileType: FileType.IMAGE,
} as const;
