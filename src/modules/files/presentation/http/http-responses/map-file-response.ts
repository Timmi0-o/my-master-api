import {
  FileAccessLevel,
  FilePurpose,
  parseImageVariantsFromMetadata,
  type IFileEntity,
  type IImageVariantsMap,
} from '../../../domain/entities/file';
import { resolveFilePublicUrl } from '../../../infrastructure/utils/resolve-file-public-url';

const resolveFileAccessLevelForHttpResponse = (
  file: IFileEntity,
): FileAccessLevel => {
  if (file.accessLevel != null) {
    return file.accessLevel;
  }

  if (
    file.purpose === FilePurpose.MASTER_SERVICE_IMAGE ||
    file.purpose === FilePurpose.MASTER_PROFILE_PHOTO ||
    file.purpose === FilePurpose.MASTER_PROFILE_BANNER ||
    file.purpose === FilePurpose.PROFILE_PHOTO ||
    file.purpose === FilePurpose.PROFILE_BANNER
  ) {
    return FileAccessLevel.PUBLIC;
  }

  return FileAccessLevel.PRIVATE;
};

const mapImageVariantsForHttpResponse = (
  file: IFileEntity,
  accessLevel: FileAccessLevel,
): IImageVariantsMap | undefined => {
  const variants = parseImageVariantsFromMetadata(file.metadata);
  if (!variants) {
    return undefined;
  }

  return {
    small: {
      ...variants.small,
      fileUrl: variants.small.fileUrl.startsWith('s3://')
        ? resolveFilePublicUrl(variants.small.fileUrl, accessLevel)
        : variants.small.fileUrl,
    },
    medium: {
      ...variants.medium,
      fileUrl: variants.medium.fileUrl.startsWith('s3://')
        ? resolveFilePublicUrl(variants.medium.fileUrl, accessLevel)
        : variants.medium.fileUrl,
    },
    high: {
      ...variants.high,
      fileUrl: variants.high.fileUrl.startsWith('s3://')
        ? resolveFilePublicUrl(variants.high.fileUrl, accessLevel)
        : variants.high.fileUrl,
    },
  };
};

export function mapFileToHttpResponse(file: IFileEntity) {
  const accessLevel = resolveFileAccessLevelForHttpResponse(file);
  const variants = mapImageVariantsForHttpResponse(file, accessLevel);

  return {
    ...file,
    fileSize: Number(file.fileSize),
    fileUrl: file.fileUrl.startsWith('s3://')
      ? resolveFilePublicUrl(file.fileUrl, accessLevel)
      : file.fileUrl,
    ...(variants ? { variants } : {}),
  };
}

export function mapFilesToHttpResponse(files: IFileEntity[]) {
  return files.map(mapFileToHttpResponse);
}
