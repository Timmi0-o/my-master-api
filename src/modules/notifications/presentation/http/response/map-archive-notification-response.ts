import type { IArchiveNotificationApplicationOutput } from 'src/modules/notifications/application/dtos/notification/archive-notification.output';
import { mapNotificationHttpResponse } from './map-notification-http-response';

export function mapArchiveNotificationHttpResponse(
  output: IArchiveNotificationApplicationOutput,
) {
  return mapNotificationHttpResponse(output);
}
