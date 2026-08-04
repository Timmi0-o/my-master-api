import type { GetNotificationsOutput } from 'src/modules/notifications/application/dtos/notification/get-notifications.output';
import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/http-responses/build-paginated-list-response';
import type { IGetNotificationsQueryPayload } from '../validation/schemas/get-notifications-query.types';
import { mapNotificationEntityToHttpResponse } from './map-notification-http-response';

export function mapGetNotificationsHttpResponse(
  output: GetNotificationsOutput,
  payload: IGetNotificationsQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items.map((item) =>
      mapNotificationEntityToHttpResponse(item),
    ),
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}
