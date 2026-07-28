import type {
  INotificationPublicEntity,
  INotificationRelations,
} from 'src/modules/notifications/domain/entities/notification';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { INotificationFiltersPreset } from '../../validation/types/notification-filters-preset.types';

export function extractNotificationFilter(
  filter: INotificationFiltersPreset | undefined,
  isStaffUser: boolean,
):
  | WhereFilter<INotificationPublicEntity, INotificationRelations>
  | undefined {
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);

  if (!sanitized) {
    return undefined;
  }

  const parts: WhereFilter<
    INotificationPublicEntity,
    INotificationRelations
  >[] = [];

  const pushString = (
    field: keyof INotificationPublicEntity & string,
    value: INotificationFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<INotificationPublicEntity>(field, value);
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('userId', sanitized.userId);
  pushString('actorUserId', sanitized.actorUserId);
  pushString(
    'category',
    sanitized.category as INotificationFiltersPreset['id'],
  );
  pushString('type', sanitized.type as INotificationFiltersPreset['id']);

  if (sanitized.isRead) {
    parts.push({
      readAt: { isNull: !sanitized.isRead.value },
    });
  }

  if (sanitized.isArchived) {
    parts.push({
      archivedAt: { isNull: !sanitized.isArchived.value },
    });
  }

  const pushDate = (
    field: keyof INotificationPublicEntity & string,
    value: INotificationFiltersPreset['createdAt'],
  ): void => {
    if (!value) return;
    const part = mapMultiDateRangeFilter<INotificationPublicEntity>(
      field,
      value,
    );
    if (part) parts.push(part);
  };

  pushDate('createdAt', sanitized.createdAt);
  pushDate('updatedAt', sanitized.updatedAt);
  pushDate('deletedAt', sanitized.deletedAt);

  if (!parts.length) {
    return undefined;
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return { and: parts };
}
