import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';

export interface GetAppointmentChatMessagesOutput {
  items: IAppointmentChatMessagePublicEntity[];
  total: number;
}
