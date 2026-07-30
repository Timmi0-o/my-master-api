import type {
  INotificationPublicEntity,
  INotificationRelations,
} from 'src/modules/notifications/domain/entities/notification';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/request-mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/request-mappers/shared/staff-visibility.helper';
import { NOTIFICATION_STAFF_ONLY_FIELDS } from 'src/modules/notifications/domain/entities/notification/notification-select-fields';
import type { INotificationFiltersPreset } from '../../validation/types/notification-filters-preset.types';

export function extractNotificationFilter(
  filter: INotificationFiltersPreset | undefined,
  isStaffUser: boolean,
):
  | WhereFilter<INotificationPublicEntity, INotificationRelations>
  | undefined {
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(filter, isStaffUser, NOTIFICATION_STAFF_ONLY_FIELDS);
  if (!sanitized) return undefined;

  const parts: WhereFilter<
    INotificationPublicEntity,
    INotificationRelations
  >[] = [];

  queryFilterBuildManager(parts, [
    { type: 'stringArray', field: 'id', value: sanitized.id },
    { type: 'stringArray', field: 'userId', value: sanitized.userId },
    {
      type: 'stringArray',
      field: 'actorUserId',
      value: sanitized.actorUserId,
    },
    {
      type: 'stringArray',
      field: 'category',
      value: sanitized.category as INotificationFiltersPreset['id'],
    },
    {
      type: 'stringArray',
      field: 'type',
      value: sanitized.type as INotificationFiltersPreset['id'],
    },
    { type: 'nullStatus', field: 'readAt', value: sanitized.isRead },
    { type: 'nullStatus', field: 'archivedAt', value: sanitized.isArchived },
    { type: 'dateRange', field: 'createdAt', value: sanitized.createdAt },
    { type: 'dateRange', field: 'updatedAt', value: sanitized.updatedAt },
    { type: 'dateRange', field: 'deletedAt', value: sanitized.deletedAt },
  ]);

  return finalizeWhereFilterParts(parts);
}
