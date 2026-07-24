import type { IPresignedUploadFileItemInput } from 'src/modules/files/application/dtos/file/presigned-upload.input';
import {
  IMAGE_ENTITY_CONFIG,
  type ImageEntityType,
} from 'src/modules/masters/domain/entities/image';
import type { IPresignImageFileInput } from '../../dtos/image/presign-images.input';

export function toPresignedUploadFilesForEntityImages(
  entityType: ImageEntityType,
  entityId: string,
  uploadedBy: string,
  files: readonly IPresignImageFileInput[],
): IPresignedUploadFileItemInput[] {
  const defaults = IMAGE_ENTITY_CONFIG[entityType];

  return files.map((file) => ({
    name: file.name,
    sha256sum: file.sha256sum,
    ownerId: entityId,
    uploadedBy,
    ownerKind: defaults.ownerKind,
    ownerType: defaults.ownerType,
    accessLevel: defaults.accessLevel,
    purpose: defaults.purpose,
    fileType: defaults.fileType,
  }));
}
