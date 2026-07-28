import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IGetUnreadNotificationsCountApplicationOutput } from 'src/modules/notifications/application/dtos/notification/get-unread-notifications-count.output';

export function mapGetUnreadNotificationsCountHttpResponse(
  output: IGetUnreadNotificationsCountApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}
