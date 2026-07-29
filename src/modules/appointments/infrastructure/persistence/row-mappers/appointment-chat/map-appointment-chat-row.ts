import type {
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import { resolveDisplayAppointment } from 'src/modules/appointments/domain/entities/appointment-chat';
import type { EAppointmentChatMessageActor } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { mapAppointmentRow } from '../appointment/map-appointment-row';
import type { AppointmentRow } from '../appointment/appointment.row.types';
import type { AppointmentChatRow } from './appointment-chat.row.types';

function mapMessageRow(m: {
  id: string;
  chatId: string;
  senderUserId: string | null;
  actor: EAppointmentChatMessageActor;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}) {
  return {
    id: m.id,
    chatId: m.chatId,
    senderUserId: m.senderUserId,
    actor: m.actor,
    body: m.body,
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
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  const appointmentRows =
    row.appointments ??
    (row.appointment != null ? [row.appointment] : null);

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
