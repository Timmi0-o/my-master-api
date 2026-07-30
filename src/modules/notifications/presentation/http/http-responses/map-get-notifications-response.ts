import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/http-responses/build-paginated-list-response';
import type { GetNotificationsOutput } from 'src/modules/notifications/application/dtos/notification/get-notifications.output';
import type { IGetNotificationsQueryPayload } from '../validation/schemas/get-notifications-query.types';

export function mapGetNotificationsHttpResponse(
  output: GetNotificationsOutput,
  payload: IGetNotificationsQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}
