import { mapDeleteSuccessHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-delete-success-http-response';

export type IDeleteAppointmentHttpResponse = ReturnType<typeof mapDeleteAppointmentHttpResponse>;

export function mapDeleteAppointmentHttpResponse() {
  return mapDeleteSuccessHttpResponse();
}
