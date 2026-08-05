import type { IPresignAppointmentChatAttachmentsApplicationOutput } from 'src/modules/appointments/application/dtos/appointment-chat/presign-appointment-chat-attachments.output';

export function mapPresignAppointmentChatAttachmentsHttpResponse(
  output: IPresignAppointmentChatAttachmentsApplicationOutput,
) {
  return {
    data: output,
  };
}
