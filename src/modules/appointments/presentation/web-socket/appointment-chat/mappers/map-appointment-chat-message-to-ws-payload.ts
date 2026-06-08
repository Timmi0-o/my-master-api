import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';

export interface IAppointmentChatMessageWsPayload extends Omit<
  IAppointmentChatMessagePublicEntity,
  'createdAt' | 'updatedAt'
> {
  createdAt: string;
  updatedAt: string;
}

export function mapAppointmentChatMessageToWsPayload(
  message: IAppointmentChatMessagePublicEntity,
): IAppointmentChatMessageWsPayload {
  return {
    id: message.id,
    chatId: message.chatId,
    senderUserId: message.senderUserId,
    body: message.body,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
  };
}
