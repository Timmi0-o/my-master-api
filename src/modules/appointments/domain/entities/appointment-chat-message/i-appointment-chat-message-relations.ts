import type { IAppointmentChatPublicEntity } from '../appointment-chat';
import type { IAppointmentChatMessageAttachmentPublicEntity } from '../appointment-chat-message-attachment';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';

export type IAppointmentChatMessageRelations = {
  chat: IAppointmentChatPublicEntity;
  sender: IUserPublicEntity;
  attachments: IAppointmentChatMessageAttachmentPublicEntity[];
};
