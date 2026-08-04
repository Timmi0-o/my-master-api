import type {
  IImagePublicEntity,
  IProfileAvatarView,
} from 'src/modules/masters/domain/entities/image';

export function toProfileAvatarView(
  image: IImagePublicEntity,
): IProfileAvatarView {
  return {
    id: image.id,
    fileId: image.fileId,
    ...(image.file != null ? { file: image.file } : {}),
  };
}

export function groupAvatarsByEntityId(
  images: readonly IImagePublicEntity[],
): Map<string, IProfileAvatarView> {
  const grouped = new Map<string, IProfileAvatarView>();

  for (const image of images) {
    if (!grouped.has(image.entityId)) {
      grouped.set(image.entityId, toProfileAvatarView(image));
    }
  }

  return grouped;
}
