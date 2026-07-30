import { mapDeleteSuccessHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-delete-success-http-response';

export type IDeleteMasterScheduleExceptionHttpResponse = ReturnType<typeof mapDeleteMasterScheduleExceptionHttpResponse>;

export function mapDeleteMasterScheduleExceptionHttpResponse() {
  return mapDeleteSuccessHttpResponse();
}
