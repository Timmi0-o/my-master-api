import type { EAppointmentChatMessageActor } from './appointment-chat-message.enum';

export interface IAppointmentChatMessageEntity {
  id: string;
  chatId: string;
  senderUserId: string | null;
  actor: EAppointmentChatMessageActor;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IAppointmentChatMessagePublicEntity = IAppointmentChatMessageEntity;
