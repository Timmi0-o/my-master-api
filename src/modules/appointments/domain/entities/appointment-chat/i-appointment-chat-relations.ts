import type { IAppointmentPublicEntity } from '../appointment';
import type { IAppointmentChatMessagePublicEntity } from '../appointment-chat-message';

export type IAppointmentChatRelations = {
  appointment: IAppointmentPublicEntity;
  messages?: IAppointmentChatMessagePublicEntity[];
};
