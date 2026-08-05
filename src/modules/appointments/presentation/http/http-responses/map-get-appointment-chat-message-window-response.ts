import type { IGetAppointmentChatMessageWindowApplicationOutput } from 'src/modules/appointments/application/dtos/appointment-chat/get-appointment-chat-message-window.output';
import { mapAppointmentChatMessageWithAttachmentsToHttp } from './map-appointment-chat-message-with-attachments';

export function mapGetAppointmentChatMessageWindowHttpResponse(
  output: IGetAppointmentChatMessageWindowApplicationOutput,
) {
  return {
    data: output.items.map(mapAppointmentChatMessageWithAttachmentsToHttp),
    meta: {
      hasMoreBefore: output.hasMoreBefore,
      hasMoreAfter: output.hasMoreAfter,
      limit: output.limit,
    },
  };
}
