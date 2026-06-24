import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';

export type ICreateAppointmentChatMessageHttpResponse = ReturnType<typeof mapCreateAppointmentChatMessageHttpResponse>;

export function mapCreateAppointmentChatMessageHttpResponse(output: IAppointmentChatMessagePublicEntity) {
  return mapEntityHttpResponse(output);
}
