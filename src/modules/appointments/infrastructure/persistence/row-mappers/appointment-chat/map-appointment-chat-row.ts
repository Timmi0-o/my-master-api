import type {
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import { mapAppointmentRow } from '../appointment/map-appointment-row';
import type { AppointmentRow } from '../appointment/appointment.row.types';
import type { AppointmentChatRow } from './appointment-chat.row.types';

export function mapAppointmentChatRow(
  row: AppointmentChatRow,
): IAppointmentChatPublicEntity & Partial<IAppointmentChatRelations> {
  const entity: IAppointmentChatPublicEntity & Partial<IAppointmentChatRelations> = {
    id: row.id,
    appointmentId: row.appointmentId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  if (row.appointment != null) {
    entity.appointment = mapAppointmentRow(row.appointment as AppointmentRow);
  }

  if (row.messages != null) {
    entity.messages = row.messages.map((m) => ({
      id: m.id,
      chatId: m.chatId,
      senderUserId: m.senderUserId,
      body: m.body,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      deletedAt: m.deletedAt ?? null,
    }));
  }

  return entity;
}
