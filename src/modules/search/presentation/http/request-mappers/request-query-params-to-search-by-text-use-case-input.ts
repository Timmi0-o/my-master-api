import type { ISearchByTextApplicationInput } from 'src/modules/search/application/dtos/search-by-text.dto';
import type { IGetSearchQueryPayload } from '../validation/schemas/get-search-query.types';

export function requestQueryParamsToSearchByTextUseCaseInput(
  payload: IGetSearchQueryPayload,
): ISearchByTextApplicationInput {
  return {
    ...(payload.q != null && payload.q.trim() !== ''
      ? { q: payload.q.trim() }
      : {}),
    ...(payload.category != null ? { category: payload.category } : {}),
    ...(payload.localityId != null ? { localityId: payload.localityId } : {}),
    ...(payload.minPrice != null ? { minPrice: payload.minPrice } : {}),
    ...(payload.maxPrice != null ? { maxPrice: payload.maxPrice } : {}),
    ...(payload.minRating != null ? { minRating: payload.minRating } : {}),
    ...(payload.sort != null ? { sort: payload.sort } : {}),
    ...(payload.page != null ? { page: payload.page } : {}),
    ...(payload.limit != null ? { limit: payload.limit } : {}),
  };
}
