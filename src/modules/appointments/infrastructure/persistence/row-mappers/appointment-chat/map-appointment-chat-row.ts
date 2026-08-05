import type {
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import { resolveDisplayAppointment } from 'src/modules/appointments/domain/entities/appointment-chat';
import type { AppointmentRow } from '../appointment/appointment.row.types';
import { mapAppointmentRow } from '../appointment/map-appointment-row';
import {
  mapAppointmentChatMessageRow,
  type AppointmentChatMessageRow,
} from '../appointment-chat-message';
import type { AppointmentChatRow } from './appointment-chat.row.types';

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
    entity.messages = row.messages.map((message) =>
      mapAppointmentChatMessageRow(message as AppointmentChatMessageRow),
    );
  }

  return entity;
}
