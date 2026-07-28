import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type {
  INotificationPublicEntity,
  INotificationRelations,
} from 'src/modules/notifications/domain/entities/notification';
import type { IGetNotificationsQueryPayload } from '../../validation/schemas/get-notifications-query.types';
import { extractNotificationFilter } from './extract-notification-filter';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToFindManyParams(
  payload: IGetNotificationsQueryPayload,
  metadata: IGetMetadata,
  actorUserId: string,
): FindManyParams<INotificationPublicEntity, INotificationRelations> {
  const filterWhere = extractNotificationFilter(
    payload.filter,
    metadata.isStaffUser,
  );

  const orderField = payload.orderField ?? 'createdAt';
  const orderDir = payload.orderDir ?? 'desc';
  const includeArchived = payload.filter?.isArchived?.value === true;

  return {
    where: {
      ...(metadata.isStaffUser
        ? {}
        : {
            deletedAt: { isNull: true },
            userId: { eq: actorUserId },
            ...(includeArchived ? {} : { archivedAt: { isNull: true } }),
          }),
      ...(filterWhere ?? {}),
    },
    slice: mapPaginationToSlice({
      page: payload.page,
      limit: payload.limit,
    }),
    orderBy: mapOrderBy<INotificationPublicEntity>({
      [orderField]: orderDir,
    }),
    selectOptions: presetToSelectOptions(payload.preset, metadata.isStaffUser),
    requiredIds: payload.requiredIds,
  };
}
