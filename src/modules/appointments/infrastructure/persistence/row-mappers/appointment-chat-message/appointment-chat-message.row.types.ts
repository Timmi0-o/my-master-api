import type {
  EAppointmentChatMessageActor,
  EAppointmentChatSystemAction,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { AppointmentChatRow } from '../appointment-chat/appointment-chat.row.types';
import type { AppointmentChatMessageAttachmentRow } from '../appointment-chat-message-attachment/map-appointment-chat-message-attachment-row';
import type { UserRow } from 'src/modules/users/infrastructure/persistence/row-mappers/user/user.row.types';

export type AppointmentChatMessageRow = {
  id: string;
  chatId: string;
  senderUserId: string | null;
  actor: EAppointmentChatMessageActor;
  body: string | null;
  systemAction: EAppointmentChatSystemAction | null;
  payload: unknown | null;
  editedAt: Date | null;
  editedHistory: string[];
  deletedForUserIds: string[];
  replyToMessageId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  chat?: AppointmentChatRow | null;
  sender?: UserRow | null;
  attachments?: AppointmentChatMessageAttachmentRow[] | null;
};
