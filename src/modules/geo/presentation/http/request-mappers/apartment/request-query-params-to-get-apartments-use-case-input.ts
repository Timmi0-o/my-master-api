import type { IGetApartmentsApplicationInput } from 'src/modules/geo/application/dtos/apartment/get-apartments.input';
import type { IGetApartmentsQueryPayload } from '../../validation/schemas/get-apartments-query.types';
import { mapPageLimitToOffsetLimit } from '../shared/map-page-limit-to-offset-limit';

export function requestQueryParamsToGetApartmentsUseCaseInput(
  payload: IGetApartmentsQueryPayload,
): IGetApartmentsApplicationInput {
  const { limit, offset } = mapPageLimitToOffsetLimit(
    payload.page,
    payload.limit,
  );

  return {
    buildingId: payload.buildingId,
    ...(payload.search != null && payload.search.trim() !== ''
      ? { search: payload.search.trim() }
      : {}),
    limit,
    offset,
  };
}
