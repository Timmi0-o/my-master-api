export interface IAppointmentChatMessageEntity {
  id: string;
  chatId: string;
  senderUserId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IAppointmentChatMessagePublicEntity = IAppointmentChatMessageEntity;
