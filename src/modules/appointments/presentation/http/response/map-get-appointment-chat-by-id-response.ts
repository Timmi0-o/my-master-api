import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IAppointmentChatPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat';

export type IGetAppointmentChatByIdHttpResponse = ReturnType<typeof mapGetAppointmentChatByIdHttpResponse>;

export function mapGetAppointmentChatByIdHttpResponse(output: IAppointmentChatPublicEntity) {
  return mapEntityHttpResponse(output);
}
