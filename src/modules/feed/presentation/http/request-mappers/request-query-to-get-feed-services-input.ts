import { GET_MANY_DEFAULT_LIMIT, GET_MANY_DEFAULT_PAGE } from 'src/constants';
import type { IGetFeedServicesApplicationInput } from 'src/modules/feed/application/dtos/i-get-feed-services-input.dto';
import type { IGetFeedServicesQueryPayload } from '../validation/schemas/get-feed-services-query.types';

export function requestQueryToGetFeedServicesInput(
  payload: IGetFeedServicesQueryPayload,
  userId: string,
): IGetFeedServicesApplicationInput {
  return {
    userId,
    ...(payload.localityId != null ? { localityId: payload.localityId } : {}),
    page: payload.page ?? GET_MANY_DEFAULT_PAGE,
    limit: payload.limit ?? GET_MANY_DEFAULT_LIMIT,
  };
}
