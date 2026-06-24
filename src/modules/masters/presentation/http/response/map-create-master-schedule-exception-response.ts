import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IMasterScheduleExceptionPublicEntity } from 'src/modules/masters/domain/entities/master-schedule-exception';

export type ICreateMasterScheduleExceptionHttpResponse = ReturnType<typeof mapCreateMasterScheduleExceptionHttpResponse>;

export function mapCreateMasterScheduleExceptionHttpResponse(output: IMasterScheduleExceptionPublicEntity) {
  return mapEntityHttpResponse(output);
}
