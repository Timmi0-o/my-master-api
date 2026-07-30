import type { IGetNotificationByIdApplicationOutput } from 'src/modules/notifications/application/dtos/notification/get-notification-by-id.output';
import { mapNotificationHttpResponse } from './map-notification-http-response';

export function mapGetNotificationByIdHttpResponse(
  output: IGetNotificationByIdApplicationOutput,
) {
  return mapNotificationHttpResponse(output);
}
