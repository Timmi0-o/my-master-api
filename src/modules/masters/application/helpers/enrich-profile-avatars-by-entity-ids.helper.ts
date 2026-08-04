import type { ImageEntityType } from 'src/modules/masters/domain/entities/image';
import type { IProfileAvatarView } from 'src/modules/masters/domain/entities/image';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import { groupAvatarsByEntityId } from './profile-avatar-batch.helper';

export async function enrichProfileAvatarsByEntityIds(params: {
  imageRepository: IImageRepository;
  entityType: ImageEntityType;
  entityIds: readonly string[];
}): Promise<Map<string, IProfileAvatarView>> {
  const uniqueIds = [
    ...new Set(
      params.entityIds.filter(
        (id): id is string => typeof id === 'string' && id.length > 0,
      ),
    ),
  ];

  if (uniqueIds.length === 0) {
    return new Map();
  }

  const images = await params.imageRepository.findByEntityTypeAndEntityIds(
    params.entityType,
    uniqueIds,
    { includeFile: true },
  );

  return groupAvatarsByEntityId(images);
}
