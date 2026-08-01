import { EAppointmentStatus } from '../appointment.enum';
import { AppointmentNotCompletableError } from '../errors';
import type { IAppointmentEntity } from '../i-appointment.entity';

const COMPLETABLE_STATUSES: ReadonlySet<EAppointmentStatus> = new Set([
  EAppointmentStatus.PENDING,
  EAppointmentStatus.CONFIRMED,
]);

export function ensureAppointmentCompletable(
  appointment: IAppointmentEntity,
  now: Date = new Date(),
): void {
  if (!COMPLETABLE_STATUSES.has(appointment.status)) {
    throw new AppointmentNotCompletableError(appointment.id, 'status', {
      status: appointment.status,
    });
  }

  if (now.getTime() < appointment.startsAt.getTime()) {
    throw new AppointmentNotCompletableError(appointment.id, 'not_started', {
      startsAt: appointment.startsAt.toISOString(),
    });
  }
}
