import { mapDeleteSuccessHttpResponse } from 'src/modules/shared/presentation/http/response/map-delete-success-http-response';

export type IDeleteMasterWeeklyScheduleHttpResponse = ReturnType<typeof mapDeleteMasterWeeklyScheduleHttpResponse>;

export function mapDeleteMasterWeeklyScheduleHttpResponse() {
  return mapDeleteSuccessHttpResponse();
}
