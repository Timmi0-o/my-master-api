import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatMessageAttachmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import { mapAppointmentChatMessageWithAttachmentsToHttp } from './map-appointment-chat-message-with-attachments';

export type ICreateAppointmentChatMessageHttpResponse = ReturnType<
  typeof mapCreateAppointmentChatMessageHttpResponse
>;

export function mapCreateAppointmentChatMessageHttpResponse(
  output: IAppointmentChatMessagePublicEntity & {
    attachments?: IAppointmentChatMessageAttachmentPublicEntity[];
  },
) {
  return mapEntityHttpResponse(
    mapAppointmentChatMessageWithAttachmentsToHttp(output),
  );
}
