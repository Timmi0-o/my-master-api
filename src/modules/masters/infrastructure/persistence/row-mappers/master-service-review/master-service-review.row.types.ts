import type { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment';
import type { MasterProfileRelationRow } from '../master-service/master-service.row.types';
import type { MasterServiceRow } from '../master-service/master-service.row.types';

export type MasterServiceReviewClientUserRow = {
  id: string;
  username: string;
  name: string;
  surname: string;
  patronymic: string | null;
};

export type MasterServiceReviewAppointmentRow = {
  id: string;
  masterProfileId: string;
  masterServiceId: string;
  clientUserId: string;
  startsAt: Date;
  durationMinutes: number;
  status: EAppointmentStatus;
  totalPrice: number;
  serviceName: string;
  cancelledAt: Date | null;
  cancelReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type MasterServiceReviewRow = {
  id: string;
  clientUserId: string;
  masterServiceId: string;
  appointmentId: string;
  rating: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  masterService?: (MasterServiceRow & {
    masterProfile?: MasterProfileRelationRow | null;
  }) | null;
  clientUser?: MasterServiceReviewClientUserRow | null;
  appointment?: MasterServiceReviewAppointmentRow | null;
};
