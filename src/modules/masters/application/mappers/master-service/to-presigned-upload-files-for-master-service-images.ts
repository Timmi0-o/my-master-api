import type { IPresignedUploadFileItemInput } from 'src/modules/files/application/dtos/file/presigned-upload.input';
import { MASTER_SERVICE_IMAGE_FILE_DEFAULTS } from 'src/modules/masters/domain/entities/master-service-image';
import type { IPresignMasterServiceImageFileInput } from '../../dtos/master-service/presign-master-service-images.input';

export function toPresignedUploadFilesForMasterServiceImages(
  masterServiceId: string,
  uploadedBy: string,
  files: readonly IPresignMasterServiceImageFileInput[],
): IPresignedUploadFileItemInput[] {
  return files.map((file) => ({
    name: file.name,
    sha256sum: file.sha256sum,
    ownerId: masterServiceId,
    uploadedBy,
    ...MASTER_SERVICE_IMAGE_FILE_DEFAULTS,
  }));
}
