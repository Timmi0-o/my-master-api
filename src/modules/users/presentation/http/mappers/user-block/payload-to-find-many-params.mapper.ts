import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type {
  IUserBlockPublicEntity,
  IUserBlockRelations,
} from 'src/modules/users/domain/entities/user-block';
import type { IGetUserBlocksQueryPayload } from '../../validation/schemas/get-user-blocks-query.types';
import { extractUserBlockFilter } from './extract-user-block-filter';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function payloadToFindManyParams(
  payload: IGetUserBlocksQueryPayload,
  metadata: IGetMetadata,
  actorUserId: string,
): FindManyParams<IUserBlockPublicEntity, IUserBlockRelations> {
  const filterWhere = extractUserBlockFilter(
    payload.filter,
    metadata.isStaffUser,
  );

  const orderField = payload.orderField ?? 'createdAt';
  const orderDir = payload.orderDir ?? 'desc';

  return {
    where: {
      ...(metadata.isStaffUser
        ? {}
        : {
            deletedAt: { isNull: true },
            blockerUserId: { eq: actorUserId },
          }),
      ...(filterWhere ?? {}),
    },
    slice: mapPaginationToSlice({
      page: payload.page,
      limit: payload.limit,
    }),
    orderBy: mapOrderBy<IUserBlockPublicEntity>({
      [orderField]: orderDir,
    }),
    ...splitPresetReadOptions(presetToSelectOptions(payload.preset, metadata.isStaffUser)),
    requiredIds: payload.requiredIds,
  };
}
