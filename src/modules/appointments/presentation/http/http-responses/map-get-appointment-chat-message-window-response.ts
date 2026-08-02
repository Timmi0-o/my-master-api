import type { IGetAppointmentChatMessageWindowApplicationOutput } from 'src/modules/appointments/application/dtos/appointment-chat/get-appointment-chat-message-window.output';

export function mapGetAppointmentChatMessageWindowHttpResponse(
  output: IGetAppointmentChatMessageWindowApplicationOutput,
) {
  return {
    data: output.items,
    meta: {
      hasMoreBefore: output.hasMoreBefore,
      hasMoreAfter: output.hasMoreAfter,
      limit: output.limit,
    },
  };
}
