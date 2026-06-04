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

export type ICreateAppointmentChatMessageInput = Omit<
  IAppointmentChatMessageEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type IUpdateAppointmentChatMessageInput = Partial<
  Omit<ICreateAppointmentChatMessageInput, 'chatId' | 'senderUserId'>
>;
