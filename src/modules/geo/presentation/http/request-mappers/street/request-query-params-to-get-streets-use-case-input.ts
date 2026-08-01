import type { IGetStreetsApplicationInput } from 'src/modules/geo/application/dtos/street/get-streets.input';
import type { IGetStreetsQueryPayload } from '../../validation/schemas/get-streets-query.types';
import { mapPageLimitToOffsetLimit } from '../shared/map-page-limit-to-offset-limit';

export function requestQueryParamsToGetStreetsUseCaseInput(
  payload: IGetStreetsQueryPayload,
): IGetStreetsApplicationInput {
  const { limit, offset } = mapPageLimitToOffsetLimit(
    payload.page,
    payload.limit,
  );

  return {
    localityId: payload.localityId,
    ...(payload.search != null && payload.search.trim() !== ''
      ? { search: payload.search.trim() }
      : {}),
    limit,
    offset,
  };
}
