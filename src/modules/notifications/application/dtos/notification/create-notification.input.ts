import type {
  NotificationCategory,
  NotificationRelatedEntityType,
  NotificationType,
} from 'src/modules/notifications/domain/entities/notification';

export interface ICreateNotificationApplicationInput {
  userId: string;
  actorUserId?: string | null;
  category: NotificationCategory;
  type: NotificationType;
  title: string;
  body: string;
  actionUrl?: string | null;
  relatedEntityType?: NotificationRelatedEntityType | null;
  relatedEntityId?: string | null;
  payload?: unknown | null;
  idempotencyKey?: string | null;
}
