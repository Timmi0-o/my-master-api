import type { INotificationPublicEntity } from './i-notification.entity';

export const NOTIFICATION_SELECT_FIELDS = [
  'id',
  'userId',
  'actorUserId',
  'category',
  'type',
  'title',
  'body',
  'actionUrl',
  'relatedEntityType',
  'relatedEntityId',
  'payload',
  'idempotencyKey',
  'readAt',
  'archivedAt',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof INotificationPublicEntity)[];

export const NOTIFICATION_STAFF_ONLY_FIELDS = [
  'deletedAt',
] as const satisfies readonly (keyof INotificationPublicEntity)[];
