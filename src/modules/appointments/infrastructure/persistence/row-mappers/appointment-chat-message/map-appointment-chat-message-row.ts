import type {
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { mapUserRow } from 'src/modules/users/infrastructure/persistence/row-mappers/user/map-user-row';
import type { UserRow } from 'src/modules/users/infrastructure/persistence/row-mappers/user/user.row.types';
import { mapAppointmentChatRow } from '../appointment-chat/map-appointment-chat-row';
import type { AppointmentChatRow } from '../appointment-chat/appointment-chat.row.types';
import type { AppointmentChatMessageRow } from './appointment-chat-message.row.types';

export function mapAppointmentChatMessageRow(
  row: AppointmentChatMessageRow,
): IAppointmentChatMessagePublicEntity & Partial<IAppointmentChatMessageRelations> {
  const entity: IAppointmentChatMessagePublicEntity &
    Partial<IAppointmentChatMessageRelations> = {
    id: row.id,
    chatId: row.chatId,
    senderUserId: row.senderUserId,
    body: row.body,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  if (row.chat != null) {
    entity.chat = mapAppointmentChatRow(row.chat as AppointmentChatRow);
  }
  if (row.sender != null) {
    entity.sender = mapUserRow(row.sender as UserRow);
  }

  return entity;
}
