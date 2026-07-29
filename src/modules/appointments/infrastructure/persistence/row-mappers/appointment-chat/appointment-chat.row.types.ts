import type { EAppointmentChatMessageActor } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { AppointmentRow } from '../appointment/appointment.row.types';

export type AppointmentChatMessageRelationRow = {
  id: string;
  chatId: string;
  senderUserId: string | null;
  actor: EAppointmentChatMessageActor;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type AppointmentChatRow = {
  id: string;
  masterProfileId: string;
  clientUserId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  /** Prisma relation name when include.appointment → prismaName appointments */
  appointments?: AppointmentRow[] | null;
  appointment?: AppointmentRow | null;
  messages?: AppointmentChatMessageRelationRow[] | null;
};
