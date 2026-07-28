import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { INotificationPublicEntity } from 'src/modules/notifications/domain/entities/notification';

export function mapNotificationHttpResponse(entity: INotificationPublicEntity) {
  return mapEntityHttpResponse(entity);
}
