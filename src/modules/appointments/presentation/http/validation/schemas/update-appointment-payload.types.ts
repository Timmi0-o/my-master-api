import type {
  EAppointmentCancelledBy,
  EAppointmentStatus,
} from 'src/modules/appointments/domain/entities/appointment/appointment.enum';

export interface IUpdateAppointmentPayload {
  startsAt?: string;
  status?: EAppointmentStatus;
  cancelledAt?: string | null;
  cancelledBy?: EAppointmentCancelledBy | null;
  cancelReason?: string | null;
}
