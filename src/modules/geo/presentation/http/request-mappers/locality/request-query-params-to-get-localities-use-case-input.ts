import type { IGetLocalitiesApplicationInput } from 'src/modules/geo/application/dtos/locality/get-localities.input';
import type { IGetLocalitiesQueryPayload } from '../../validation/schemas/get-localities-query.types';
import { mapPageLimitToOffsetLimit } from '../shared/map-page-limit-to-offset-limit';

export function requestQueryParamsToGetLocalitiesUseCaseInput(
  payload: IGetLocalitiesQueryPayload,
): IGetLocalitiesApplicationInput {
  const { limit, offset } = mapPageLimitToOffsetLimit(
    payload.page,
    payload.limit,
  );

  return {
    ...(payload.search != null && payload.search.trim() !== ''
      ? { search: payload.search.trim() }
      : {}),
    ...(payload.regionId != null ? { regionId: payload.regionId } : {}),
    limit,
    offset,
  };
}
