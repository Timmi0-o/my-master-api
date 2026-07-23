import type { IAppointmentEntity } from '../i-appointment.entity';
import { EAppointmentStatus } from '../appointment.enum';
import { AppointmentNotCompletableError } from '../errors';

const COMPLETABLE_STATUSES: ReadonlySet<EAppointmentStatus> = new Set([
  EAppointmentStatus.PENDING,
  EAppointmentStatus.CONFIRMED,
]);

export function ensureAppointmentCompletable(
  appointment: IAppointmentEntity,
): void {
  if (!COMPLETABLE_STATUSES.has(appointment.status)) {
    throw new AppointmentNotCompletableError(
      appointment.id,
      appointment.status,
    );
  }
}
