import type { IMarkNotificationReadApplicationOutput } from 'src/modules/notifications/application/dtos/notification/mark-notification-read.output';
import { mapNotificationHttpResponse } from './map-notification-http-response';

export function mapMarkNotificationReadHttpResponse(
  output: IMarkNotificationReadApplicationOutput,
) {
  return mapNotificationHttpResponse(output);
}
