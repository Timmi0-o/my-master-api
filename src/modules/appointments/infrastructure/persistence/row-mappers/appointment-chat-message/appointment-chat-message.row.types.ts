import type { AppointmentChatRow } from '../appointment-chat/appointment-chat.row.types';
import type { UserRow } from 'src/modules/users/infrastructure/persistence/row-mappers/user/user.row.types';

export type AppointmentChatMessageRow = {
  id: string;
  chatId: string;
  senderUserId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  chat?: AppointmentChatRow | null;
  sender?: UserRow | null;
};
