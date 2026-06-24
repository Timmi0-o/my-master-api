import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IMasterScheduleExceptionPublicEntity } from 'src/modules/masters/domain/entities/master-schedule-exception';

export type IUpdateMasterScheduleExceptionHttpResponse = ReturnType<typeof mapUpdateMasterScheduleExceptionHttpResponse>;

export function mapUpdateMasterScheduleExceptionHttpResponse(output: IMasterScheduleExceptionPublicEntity) {
  return mapEntityHttpResponse(output);
}
