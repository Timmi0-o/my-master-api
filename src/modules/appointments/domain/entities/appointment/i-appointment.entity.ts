import type {
  EAppointmentCancelledBy,
  EAppointmentStatus,
} from './appointment.enum';

export interface IAppointmentEntity {
  id: string;
  masterProfileId: string;
  masterServiceId: string;
  clientUserId: string;
  startsAt: Date;
  durationMinutes: number;
  status: EAppointmentStatus;
  totalPrice: number;
  serviceName: string;
  cancelledAt?: Date | null;
  cancelledBy?: EAppointmentCancelledBy | null;
  cancelReason?: string | null;
  isEarlyCompletionByMaster: boolean;
  isEarlyCompletionByClient: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IAppointmentPublicEntity = IAppointmentEntity;
