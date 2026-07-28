import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IMarkAllNotificationsReadApplicationOutput } from 'src/modules/notifications/application/dtos/notification/mark-all-notifications-read.output';

export function mapMarkAllNotificationsReadHttpResponse(
  output: IMarkAllNotificationsReadApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}
