import type {
  NotificationCategory,
  NotificationRelatedEntityType,
  NotificationType,
} from 'src/modules/notifications/domain/entities/notification';

export type NotificationActorUserProfileRow = {
  id: string;
  userId: string;
  displayName: string;
};

export type NotificationActorRow = {
  id: string;
  username: string;
  name: string;
  surname: string;
  patronymic: string | null;
  userProfile?: NotificationActorUserProfileRow | null;
};

export type NotificationRow = {
  id: string;
  userId: string;
  actorUserId: string | null;
  category: NotificationCategory;
  type: NotificationType;
  title: string;
  body: string;
  actionUrl: string | null;
  relatedEntityType: NotificationRelatedEntityType | null;
  relatedEntityId: string | null;
  payload: unknown | null;
  idempotencyKey: string | null;
  readAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  actor?: NotificationActorRow | null;
};
