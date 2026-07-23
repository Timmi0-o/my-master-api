import type {
  IMasterServiceReviewEntity,
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations,
} from 'src/modules/masters/domain/entities/master-service-review';
import { mapMasterServiceRow } from '../master-service/map-master-service-row';
import type { MasterServiceRow } from '../master-service/master-service.row.types';
import type { MasterServiceReviewRow } from './master-service-review.row.types';

function mapClientUserRelation(
  row: NonNullable<MasterServiceReviewRow['clientUser']>,
): IMasterServiceReviewRelations['clientUser'] {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    surname: row.surname,
    patronymic: row.patronymic,
  };
}

function mapAppointmentRelation(
  row: NonNullable<MasterServiceReviewRow['appointment']>,
): IMasterServiceReviewRelations['appointment'] {
  return {
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
}

export function mapMasterServiceReviewRow(
  row: MasterServiceReviewRow,
): IMasterServiceReviewPublicEntity & Partial<IMasterServiceReviewRelations> {
  const entity: IMasterServiceReviewEntity &
    Partial<IMasterServiceReviewRelations> = {
    id: row.id,
    clientUserId: row.clientUserId,
    masterServiceId: row.masterServiceId,
    appointmentId: row.appointmentId,
    rating: row.rating,
    text: row.text,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  if (row.masterService != null) {
    entity.masterService = mapMasterServiceRow(
      row.masterService as MasterServiceRow,
    );
  }

  if (row.clientUser != null) {
    entity.clientUser = mapClientUserRelation(row.clientUser);
  }

  if (row.appointment != null) {
    entity.appointment = mapAppointmentRelation(row.appointment);
  }

  return entity;
}
