import type {
  NotificationCategory,
  NotificationRelatedEntityType,
  NotificationType,
} from './notification.enums';

export interface INotificationEntity {
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
}

export type INotificationPublicEntity = INotificationEntity;
