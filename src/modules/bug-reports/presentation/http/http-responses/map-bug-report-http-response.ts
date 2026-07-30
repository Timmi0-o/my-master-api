import type { IBugReportPublicEntity } from 'src/modules/bug-reports/domain/entities/bug-report';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';

export function mapBugReportHttpResponse(entity: IBugReportPublicEntity) {
  return mapEntityHttpResponse(entity);
}
