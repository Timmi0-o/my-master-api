import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type {
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations,
} from 'src/modules/masters/domain/entities/master-service-review';
import type { IGetMasterServiceReviewsQueryPayload } from '../../validation/schemas/get-master-service-reviews-query.types';
import { extractMasterServiceReviewFilter } from './extract-master-service-review-filter';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function requestQueryParamsToFindManyParams(
  queryParams: IGetMasterServiceReviewsQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations
> {
  const filterWhere = extractMasterServiceReviewFilter(
    queryParams.filter,
    metadata.isStaffUser,
  );

  const orderField = queryParams.orderField ?? 'createdAt';
  const orderDir = queryParams.orderDir ?? 'desc';

  return {
    where: {
      ...(metadata.isStaffUser ? {} : { deletedAt: { isNull: true } }),
      ...(filterWhere ?? {}),
    },
    slice: mapPaginationToSlice({
      page: queryParams.page,
      limit: queryParams.limit,
    }),
    orderBy: mapOrderBy<IMasterServiceReviewPublicEntity>({
      [orderField]: orderDir,
    }),
    ...splitPresetReadOptions(presetToSelectOptions(queryParams.preset, metadata.isStaffUser)),
    requiredIds: queryParams.requiredIds,
  };
}
