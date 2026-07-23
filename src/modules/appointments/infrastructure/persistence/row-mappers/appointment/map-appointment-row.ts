import type {
  IAppointmentEntity,
  IAppointmentPublicEntity,
  IAppointmentRelations,
} from 'src/modules/appointments/domain/entities/appointment';
import { mapMasterProfileRow } from 'src/modules/masters/infrastructure/persistence/row-mappers/master-profile/map-master-profile-row';
import type { MasterProfileRow } from 'src/modules/masters/infrastructure/persistence/row-mappers/master-profile/master-profile.row.types';
import { mapMasterServiceRow } from 'src/modules/masters/infrastructure/persistence/row-mappers/master-service/map-master-service-row';
import type { MasterServiceRow } from 'src/modules/masters/infrastructure/persistence/row-mappers/master-service/master-service.row.types';
import { mapUserRow } from 'src/modules/users/infrastructure/persistence/row-mappers/user/map-user-row';
import type { UserRow } from 'src/modules/users/infrastructure/persistence/row-mappers/user/user.row.types';
import type { AppointmentRow } from './appointment.row.types';

export function mapAppointmentRow(
  row: AppointmentRow,
): IAppointmentPublicEntity & Partial<IAppointmentRelations> {
  const entity: IAppointmentEntity & Partial<IAppointmentRelations> = {
    id: row.id,
    masterProfileId: row.masterProfileId,
    masterServiceId: row.masterServiceId,
    clientUserId: row.clientUserId,
    startsAt: row.startsAt,
    durationMinutes: row.durationMinutes,
    status: row.status,
    totalPrice: row.totalPrice,
    serviceName: row.serviceName,
    cancelledAt: row.cancelledAt,
    cancelledBy: row.cancelledBy,
    cancelReason: row.cancelReason,
    isEarlyCompletionByMaster: row.isEarlyCompletionByMaster,
    isEarlyCompletionByClient: row.isEarlyCompletionByClient,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  if (row.masterProfile != null) {
    entity.masterProfile = mapMasterProfileRow(
      row.masterProfile as MasterProfileRow,
    );
  }
  if (row.masterService != null) {
    entity.masterService = mapMasterServiceRow(
      row.masterService as MasterServiceRow,
    );
  }
  if (row.clientUser != null) {
    entity.clientUser = mapUserRow(row.clientUser as UserRow);
  }
  if (row.chat != null) {
    entity.chat = {
      id: row.chat.id,
      appointmentId: row.chat.appointmentId,
      createdAt: row.chat.createdAt,
      updatedAt: row.chat.updatedAt,
      deletedAt: row.chat.deletedAt ?? null,
      ...(row.chat.messages != null
        ? {
            messages: row.chat.messages.map((message) => ({
              id: message.id,
              chatId: message.chatId,
              senderUserId: message.senderUserId,
              body: message.body,
              createdAt: message.createdAt,
              updatedAt: message.updatedAt,
              deletedAt: message.deletedAt ?? null,
            })),
          }
        : {}),
    };
  }

  return entity;
}
