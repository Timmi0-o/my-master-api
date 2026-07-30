import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type {
  IMasterWeeklySchedulePublicEntity,
  IMasterWeeklyScheduleRelations,
} from 'src/modules/masters/domain/entities/master-weekly-schedule';
import type { IGetMasterWeeklySchedulesQueryPayload } from '../../validation/schemas/get-master-weekly-schedules-query.types';
import { extractMasterWeeklyScheduleFilter } from './extract-master-weekly-schedule-filter';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function requestQueryParamsToFindManyParams(
  queryParams: IGetMasterWeeklySchedulesQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<
  IMasterWeeklySchedulePublicEntity,
  IMasterWeeklyScheduleRelations
> {
  const filterWhere = extractMasterWeeklyScheduleFilter(
    queryParams.filter,
    metadata.isStaffUser,
  );

  const orderField = queryParams.orderField ?? 'id';
  const orderDir = queryParams.orderDir ?? 'asc';

  return {
    where: {
      ...(metadata.isStaffUser ? {} : { deletedAt: { isNull: true } }),
      ...(filterWhere ?? {}),
    },
    slice: mapPaginationToSlice({
      page: queryParams.page,
      limit: queryParams.limit,
    }),
    orderBy: mapOrderBy<IMasterWeeklySchedulePublicEntity>({
      [orderField]: orderDir,
    }),
    ...splitPresetReadOptions(presetToSelectOptions(queryParams.preset, metadata.isStaffUser)),
    requiredIds: queryParams.requiredIds,
  };
}
