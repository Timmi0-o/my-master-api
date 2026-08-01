import type { IGetBuildingsApplicationInput } from 'src/modules/geo/application/dtos/building/get-buildings.input';
import type { IGetBuildingsQueryPayload } from '../../validation/schemas/get-buildings-query.types';
import { mapPageLimitToOffsetLimit } from '../shared/map-page-limit-to-offset-limit';

export function requestQueryParamsToGetBuildingsUseCaseInput(
  payload: IGetBuildingsQueryPayload,
): IGetBuildingsApplicationInput {
  const { limit, offset } = mapPageLimitToOffsetLimit(
    payload.page,
    payload.limit,
  );

  return {
    streetId: payload.streetId,
    ...(payload.search != null && payload.search.trim() !== ''
      ? { search: payload.search.trim() }
      : {}),
    limit,
    offset,
  };
}
