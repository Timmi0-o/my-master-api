import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';

export type IEditAppointmentChatMessageHttpResponse = ReturnType<
  typeof mapEditAppointmentChatMessageHttpResponse
>;

export function mapEditAppointmentChatMessageHttpResponse(
  output: IAppointmentChatMessagePublicEntity,
) {
  return mapEntityHttpResponse(output);
}
