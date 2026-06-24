import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';

export type IGetAppointmentChatMessageByIdHttpResponse = ReturnType<typeof mapGetAppointmentChatMessageByIdHttpResponse>;

export function mapGetAppointmentChatMessageByIdHttpResponse(output: IAppointmentChatMessagePublicEntity) {
  return mapEntityHttpResponse(output);
}
