import type { IAppointmentChatPublicEntity } from '../appointment-chat';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';

export type IAppointmentChatMessageRelations = {
  chat: IAppointmentChatPublicEntity;
  sender: IUserPublicEntity;
};
