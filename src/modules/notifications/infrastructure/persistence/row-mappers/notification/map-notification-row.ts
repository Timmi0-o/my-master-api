import type {
  INotificationEntity,
  INotificationPublicEntity,
  INotificationRelations,
} from 'src/modules/notifications/domain/entities/notification';
import type { NotificationRow } from './notification.row.types';

export function mapNotificationRow(
  row: NotificationRow,
): INotificationPublicEntity & Partial<INotificationRelations> {
  const entity: INotificationEntity & Partial<INotificationRelations> = {
    id: row.id,
    userId: row.userId,
    actorUserId: row.actorUserId,
    category: row.category,
    type: row.type,
    title: row.title,
    body: row.body,
    actionUrl: row.actionUrl,
    relatedEntityType: row.relatedEntityType,
    relatedEntityId: row.relatedEntityId,
    payload: row.payload ?? null,
    idempotencyKey: row.idempotencyKey,
    readAt: row.readAt,
    archivedAt: row.archivedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  if (row.actor !== undefined) {
    entity.actor =
      row.actor == null
        ? null
        : {
            id: row.actor.id,
            username: row.actor.username,
            name: row.actor.name,
            surname: row.actor.surname,
            patronymic: row.actor.patronymic,
          };
  }

  return entity;
}
