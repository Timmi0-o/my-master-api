import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IMarkAppointmentChatReadApplicationOutput } from 'src/modules/appointments/application/dtos/appointment-chat/mark-appointment-chat-read.output';

export type IMarkAppointmentChatReadHttpResponse = ReturnType<
  typeof mapMarkAppointmentChatReadHttpResponse
>;

export function mapMarkAppointmentChatReadHttpResponse(
  output: IMarkAppointmentChatReadApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}
