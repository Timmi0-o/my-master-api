import {
  FileAccessLevel,
  FileOwnerType,
  FilePurpose,
  FileType,
} from 'src/modules/files/domain/entities/file';
import { ImageEntityType } from './image-entity-type.enum';

export type ImageEntityConfig = {
  maxCount: number;
  ownerKind: string;
  ownerType: FileOwnerType;
  accessLevel: FileAccessLevel;
  purpose: FilePurpose;
  fileType: FileType;
};

export const IMAGE_ENTITY_CONFIG: Record<ImageEntityType, ImageEntityConfig> = {
  [ImageEntityType.MASTER_SERVICE]: {
    maxCount: 10,
    ownerKind: 'master-service',
    ownerType: FileOwnerType.USER,
    accessLevel: FileAccessLevel.PUBLIC,
    purpose: FilePurpose.MASTER_SERVICE_IMAGE,
    fileType: FileType.IMAGE,
  },
  [ImageEntityType.MASTER_PROFILE_AVATAR]: {
    maxCount: 1,
    ownerKind: 'master-profile',
    ownerType: FileOwnerType.USER,
    accessLevel: FileAccessLevel.PUBLIC,
    purpose: FilePurpose.MASTER_PROFILE_PHOTO,
    fileType: FileType.IMAGE,
  },
  [ImageEntityType.CLIENT_PROFILE_AVATAR]: {
    maxCount: 1,
    ownerKind: 'user-profile',
    ownerType: FileOwnerType.USER,
    accessLevel: FileAccessLevel.PUBLIC,
    purpose: FilePurpose.PROFILE_PHOTO,
    fileType: FileType.IMAGE,
  },
};

export const IMAGE_FILE_SELECT_FIELDS = [
  'id',
  'fileUrl',
  'originalName',
  'mimeType',
  'fileType',
  'purpose',
  'accessLevel',
  'status',
  'fileSize',
  'createdAt',
  'updatedAt',
] as const;
