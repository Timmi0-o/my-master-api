import type { IImagePublicEntity } from 'src/modules/masters/domain/entities/image';
import type { IMasterServiceImageView } from 'src/modules/masters/domain/entities/master-service';

export function toMasterServiceImageView(
  image: IImagePublicEntity,
): IMasterServiceImageView {
  return {
    id: image.id,
    masterServiceId: image.entityId,
    fileId: image.fileId,
    createdAt: image.createdAt,
    updatedAt: image.updatedAt,
    ...(image.file != null ? { file: image.file } : {}),
  };
}

export function groupImagesByEntityId(
  images: readonly IImagePublicEntity[],
): Map<string, IMasterServiceImageView[]> {
  const grouped = new Map<string, IMasterServiceImageView[]>();

  for (const image of images) {
    const views = grouped.get(image.entityId) ?? [];
    views.push(toMasterServiceImageView(image));
    grouped.set(image.entityId, views);
  }

  return grouped;
}

export function wantsImagesInclude(include: unknown): boolean {
  if (!include || typeof include !== 'object') {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(include, 'images');
}

export function wantsNestedServiceImagesInclude(include: unknown): boolean {
  if (!include || typeof include !== 'object') {
    return false;
  }

  const services = (include as Record<string, unknown>).services;
  if (services === true) {
    return false;
  }

  if (!services || typeof services !== 'object') {
    return false;
  }

  const nestedInclude = (services as { include?: unknown }).include;
  return wantsImagesInclude(nestedInclude);
}
