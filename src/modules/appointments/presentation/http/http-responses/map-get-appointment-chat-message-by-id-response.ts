import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IAppointmentChatMessageAttachmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { mapAppointmentChatMessageWithAttachmentsToHttp } from './map-appointment-chat-message-with-attachments';

export type IGetAppointmentChatMessageByIdHttpResponse = ReturnType<
  typeof mapGetAppointmentChatMessageByIdHttpResponse
>;

export function mapGetAppointmentChatMessageByIdHttpResponse(
  output: IAppointmentChatMessagePublicEntity & {
    attachments?: IAppointmentChatMessageAttachmentPublicEntity[];
  },
) {
  return mapEntityHttpResponse(
    mapAppointmentChatMessageWithAttachmentsToHttp(output),
  );
}
