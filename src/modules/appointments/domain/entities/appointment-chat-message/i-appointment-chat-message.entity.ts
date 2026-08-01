import type {
  EAppointmentChatMessageActor,
  EAppointmentChatSystemAction,
} from './appointment-chat-message.enum';

export interface IAppointmentChatMessageEntity {
  id: string;
  chatId: string;
  senderUserId: string | null;
  actor: EAppointmentChatMessageActor;
  body: string | null;
  systemAction: EAppointmentChatSystemAction | null;
  payload: unknown | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IAppointmentChatMessagePublicEntity = IAppointmentChatMessageEntity;
