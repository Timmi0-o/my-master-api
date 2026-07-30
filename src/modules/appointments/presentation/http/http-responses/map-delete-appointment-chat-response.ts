import { mapDeleteSuccessHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-delete-success-http-response';

export type IDeleteAppointmentChatHttpResponse = ReturnType<typeof mapDeleteAppointmentChatHttpResponse>;

export function mapDeleteAppointmentChatHttpResponse() {
  return mapDeleteSuccessHttpResponse();
}
