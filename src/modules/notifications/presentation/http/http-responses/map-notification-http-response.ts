import { mapProfileAvatarToHttpResponse } from 'src/modules/masters/presentation/http/http-responses/map-profile-avatar-http-response';
import type {
  INotificationActorUserPublic,
  INotificationPublicEntity,
  INotificationRelations,
} from 'src/modules/notifications/domain/entities/notification';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';

type NotificationHttpEntity = INotificationPublicEntity &
  Partial<INotificationRelations>;

function mapNotificationActorToHttpResponse(
  actor: INotificationActorUserPublic | null | undefined,
): INotificationActorUserPublic | null | undefined {
  if (actor == null) {
    return actor;
  }

  if (actor.userProfile == null || actor.userProfile.avatar === undefined) {
    return actor;
  }

  return {
    ...actor,
    userProfile: {
      ...actor.userProfile,
      avatar: mapProfileAvatarToHttpResponse(actor.userProfile.avatar),
    },
  };
}

export function mapNotificationEntityToHttpResponse(
  entity: NotificationHttpEntity,
): NotificationHttpEntity {
  if (entity.actor === undefined) {
    return entity;
  }

  return {
    ...entity,
    actor: mapNotificationActorToHttpResponse(entity.actor),
  };
}

export function mapNotificationHttpResponse(entity: NotificationHttpEntity) {
  return mapEntityHttpResponse(mapNotificationEntityToHttpResponse(entity));
}
