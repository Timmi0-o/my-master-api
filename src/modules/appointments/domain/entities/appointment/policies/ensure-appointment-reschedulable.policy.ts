import type { IAppointmentEntity } from '../i-appointment.entity';
import { EAppointmentStatus } from '../appointment.enum';
import { AppointmentNotReschedulableError } from '../errors/appointment-not-reschedulable.error';

const RESCHEDULABLE_STATUSES: ReadonlySet<EAppointmentStatus> = new Set([
  EAppointmentStatus.PENDING,
  EAppointmentStatus.CONFIRMED,
]);

export function ensureAppointmentReschedulable(
  appointment: IAppointmentEntity,
  now: Date = new Date(),
): void {
  if (!RESCHEDULABLE_STATUSES.has(appointment.status)) {
    throw new AppointmentNotReschedulableError(appointment.id, 'status', {
      status: appointment.status,
    });
  }

  if (now.getTime() >= appointment.startsAt.getTime()) {
    throw new AppointmentNotReschedulableError(
      appointment.id,
      'already_started',
      { startsAt: appointment.startsAt.toISOString() },
    );
  }
}
