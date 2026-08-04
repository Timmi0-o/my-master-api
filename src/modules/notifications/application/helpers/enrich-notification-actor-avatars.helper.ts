import { enrichProfileAvatarsByEntityIds } from 'src/modules/masters/application/helpers/enrich-profile-avatars-by-entity-ids.helper';
import { ImageEntityType } from 'src/modules/masters/domain/entities/image';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import type {
  INotificationPublicEntity,
  INotificationRelations,
} from 'src/modules/notifications/domain/entities/notification';

type NotificationWithActor = INotificationPublicEntity &
  Partial<INotificationRelations>;

export async function enrichNotificationActorAvatars<
  T extends NotificationWithActor,
>(
  imageRepository: IImageRepository,
  items: readonly T[],
): Promise<T[]> {
  if (items.length === 0) {
    return [...items];
  }

  const profileIds = items
    .map((item) => item.actor?.userProfile?.id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0);

  const byProfileId = await enrichProfileAvatarsByEntityIds({
    imageRepository,
    entityType: ImageEntityType.CLIENT_PROFILE_AVATAR,
    entityIds: profileIds,
  });

  return items.map((item) => {
    if (item.actor?.userProfile == null) {
      return item;
    }

    return {
      ...item,
      actor: {
        ...item.actor,
        userProfile: {
          ...item.actor.userProfile,
          avatar: byProfileId.get(item.actor.userProfile.id) ?? null,
        },
      },
    };
  });
}
