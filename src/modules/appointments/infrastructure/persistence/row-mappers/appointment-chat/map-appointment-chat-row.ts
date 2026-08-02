import type {
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import { resolveDisplayAppointment } from 'src/modules/appointments/domain/entities/appointment-chat';
import type {
  EAppointmentChatMessageActor,
  EAppointmentChatSystemAction,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { AppointmentRow } from '../appointment/appointment.row.types';
import { mapAppointmentRow } from '../appointment/map-appointment-row';
import type { AppointmentChatRow } from './appointment-chat.row.types';

function mapMessageRow(m: {
  id: string;
  chatId: string;
  senderUserId: string | null;
  actor: EAppointmentChatMessageActor;
  body: string | null;
  systemAction?: EAppointmentChatSystemAction | null;
  payload?: unknown | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}) {
  return {
    id: m.id,
    chatId: m.chatId,
    senderUserId: m.senderUserId,
    actor: m.actor,
    body: m.body ?? null,
    systemAction: m.systemAction ?? null,
    payload: m.payload ?? null,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
    deletedAt: m.deletedAt ?? null,
  };
}

export function mapAppointmentChatRow(
  row: AppointmentChatRow,
): IAppointmentChatPublicEntity & Partial<IAppointmentChatRelations> {
  const entity: IAppointmentChatPublicEntity &
    Partial<IAppointmentChatRelations> = {
    id: row.id,
    masterProfileId: row.masterProfileId,
    clientUserId: row.clientUserId,
    clientLastReadAt: row.clientLastReadAt ?? null,
    masterLastReadAt: row.masterLastReadAt ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  const appointmentRows =
    row.appointments ?? (row.appointment != null ? [row.appointment] : null);

  if (appointmentRows != null) {
    const mapped = appointmentRows.map((a) =>
      mapAppointmentRow(a as AppointmentRow),
    );
    const display = resolveDisplayAppointment(mapped);
    if (display != null) {
      entity.appointment = display;
    }
  }

  if (row.messages != null) {
    entity.messages = row.messages.map(mapMessageRow);
  }

  return entity;
}
