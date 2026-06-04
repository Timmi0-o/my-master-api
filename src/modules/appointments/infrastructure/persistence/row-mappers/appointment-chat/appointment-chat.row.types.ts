import type { AppointmentRow } from '../appointment/appointment.row.types';

export type AppointmentChatMessageRelationRow = {
  id: string;
  chatId: string;
  senderUserId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type AppointmentChatRow = {
  id: string;
  appointmentId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  appointment?: AppointmentRow | null;
  messages?: AppointmentChatMessageRelationRow[] | null;
};
