import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';

export interface IAppointmentChatMessageWsPayload extends Omit<
  IAppointmentChatMessagePublicEntity,
  'createdAt' | 'updatedAt' | 'editedAt' | 'deletedAt'
> {
  createdAt: string;
  updatedAt: string;
  editedAt: string | null;
  deletedAt?: string | null;
}

export function mapAppointmentChatMessageToWsPayload(
  message: IAppointmentChatMessagePublicEntity,
): IAppointmentChatMessageWsPayload {
  return {
    id: message.id,
    chatId: message.chatId,
    senderUserId: message.senderUserId,
    actor: message.actor,
    body: message.body,
    systemAction: message.systemAction,
    payload: message.payload,
    editedAt: message.editedAt?.toISOString() ?? null,
    editedHistory: message.editedHistory,
    deletedForUserIds: message.deletedForUserIds,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
    deletedAt: message.deletedAt?.toISOString() ?? null,
  };
}
