import { mapDeleteSuccessHttpResponse } from 'src/modules/shared/presentation/http/response/map-delete-success-http-response';

export type IDeleteAppointmentChatMessageHttpResponse = ReturnType<typeof mapDeleteAppointmentChatMessageHttpResponse>;

export function mapDeleteAppointmentChatMessageHttpResponse() {
  return mapDeleteSuccessHttpResponse();
}
