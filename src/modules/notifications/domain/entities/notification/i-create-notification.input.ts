import type {
  NotificationCategory,
  NotificationRelatedEntityType,
  NotificationType,
} from './notification.enums';

export interface ICreateNotificationInput {
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
