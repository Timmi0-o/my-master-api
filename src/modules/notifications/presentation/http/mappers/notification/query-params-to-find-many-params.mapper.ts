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
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function queryParamsToFindManyParams(
  queryParams: IGetNotificationsQueryPayload,
  metadata: IGetMetadata,
  actorUserId: string,
): FindManyParams<INotificationPublicEntity, INotificationRelations> {
  const filterWhere = extractNotificationFilter(
    queryParams.filter,
    metadata.isStaffUser,
  );

  const orderField = queryParams.orderField ?? 'createdAt';
  const orderDir = queryParams.orderDir ?? 'desc';
  const includeArchived = queryParams.filter?.isArchived?.value === true;

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
      page: queryParams.page,
      limit: queryParams.limit,
    }),
    orderBy: mapOrderBy<INotificationPublicEntity>({
      [orderField]: orderDir,
    }),
    ...splitPresetReadOptions(presetToSelectOptions(queryParams.preset, metadata.isStaffUser)),
    requiredIds: queryParams.requiredIds,
  };
}
