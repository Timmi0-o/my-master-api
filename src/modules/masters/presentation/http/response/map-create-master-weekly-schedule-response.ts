import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IMasterWeeklySchedulePublicEntity } from 'src/modules/masters/domain/entities/master-weekly-schedule';

export type ICreateMasterWeeklyScheduleHttpResponse = ReturnType<typeof mapCreateMasterWeeklyScheduleHttpResponse>;

export function mapCreateMasterWeeklyScheduleHttpResponse(output: IMasterWeeklySchedulePublicEntity) {
  return mapEntityHttpResponse(output);
}
