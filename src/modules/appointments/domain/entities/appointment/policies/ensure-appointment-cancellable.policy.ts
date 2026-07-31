import type { IAppointmentEntity } from '../i-appointment.entity';
import { EAppointmentStatus } from '../appointment.enum';
import { AppointmentNotCancellableError } from '../errors';

const CANCELLABLE_STATUSES: ReadonlySet<EAppointmentStatus> = new Set([
  EAppointmentStatus.PENDING,
  EAppointmentStatus.CONFIRMED,
]);

export function ensureAppointmentCancellable(
  appointment: IAppointmentEntity,
): void {
  if (!CANCELLABLE_STATUSES.has(appointment.status)) {
    throw new AppointmentNotCancellableError(
      appointment.id,
      appointment.status,
    );
  }
}
