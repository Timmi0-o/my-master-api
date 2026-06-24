import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IMasterScheduleExceptionPublicEntity } from 'src/modules/masters/domain/entities/master-schedule-exception';

export type IGetMasterScheduleExceptionByIdHttpResponse = ReturnType<typeof mapGetMasterScheduleExceptionByIdHttpResponse>;

export function mapGetMasterScheduleExceptionByIdHttpResponse(output: IMasterScheduleExceptionPublicEntity) {
  return mapEntityHttpResponse(output);
}
