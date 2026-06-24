import {
  FileAccessLevel,
  FilePurpose,
  type IFileEntity,
} from '../../../domain/entities/file';
import { resolveFilePublicUrl } from '../../../infrastructure/utils/resolve-file-public-url';

const resolveFileAccessLevelForHttpResponse = (
  file: IFileEntity,
): FileAccessLevel => {
  if (file.accessLevel != null) {
    return file.accessLevel;
  }

  if (file.purpose === FilePurpose.MASTER_SERVICE_IMAGE) {
    return FileAccessLevel.PUBLIC;
  }

  return FileAccessLevel.PRIVATE;
};

export function mapFileToHttpResponse(file: IFileEntity) {
  return {
    ...file,
    fileSize: Number(file.fileSize),
    fileUrl: file.fileUrl.startsWith('s3://')
      ? resolveFilePublicUrl(
          file.fileUrl,
          resolveFileAccessLevelForHttpResponse(file),
        )
      : file.fileUrl,
  };
}

export function mapFilesToHttpResponse(files: IFileEntity[]) {
  return files.map(mapFileToHttpResponse);
}
