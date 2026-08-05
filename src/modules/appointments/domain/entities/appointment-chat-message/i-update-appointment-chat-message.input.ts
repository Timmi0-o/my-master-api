import type {
  EAppointmentChatMessageActor,
  EAppointmentChatSystemAction,
} from './appointment-chat-message.enum';

export type IUpdateAppointmentChatMessageInput = {
  body?: string | null;
  actor?: EAppointmentChatMessageActor;
  systemAction?: EAppointmentChatSystemAction | null;
  payload?: unknown | null;
  editedAt?: Date | null;
  editedHistory?: string[];
  deletedForUserIds?: string[];
};
