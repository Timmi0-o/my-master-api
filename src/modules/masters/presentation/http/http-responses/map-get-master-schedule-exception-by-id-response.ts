import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IMasterScheduleExceptionPublicEntity } from 'src/modules/masters/domain/entities/master-schedule-exception';

export type IGetMasterScheduleExceptionByIdHttpResponse = ReturnType<typeof mapGetMasterScheduleExceptionByIdHttpResponse>;

export function mapGetMasterScheduleExceptionByIdHttpResponse(output: IMasterScheduleExceptionPublicEntity) {
  return mapEntityHttpResponse(output);
}
