import type { ISearchByTextApplicationInput } from 'src/modules/search/application/dtos/search-by-text.dto';
import type { IGetSearchQueryPayload } from '../validation/schemas/get-search-query.types';

export function payloadToSearchByTextInput(
  payload: IGetSearchQueryPayload,
): ISearchByTextApplicationInput {
  return {
    ...(payload.q != null && payload.q.trim() !== ''
      ? { q: payload.q.trim() }
      : {}),
    ...(payload.category != null ? { category: payload.category } : {}),
    ...(payload.limit != null ? { limit: payload.limit } : {}),
  };
}
