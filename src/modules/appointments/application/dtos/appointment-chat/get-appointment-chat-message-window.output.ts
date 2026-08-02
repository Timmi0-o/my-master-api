import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';

export type IGetAppointmentChatMessageWindowApplicationOutput = {
  items: IAppointmentChatMessagePublicEntity[];
  hasMoreBefore: boolean;
  hasMoreAfter: boolean;
  limit: number;
};
