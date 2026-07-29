import type { IAppointmentEntity } from '../appointment/i-appointment.entity';
import { EAppointmentStatus } from '../appointment/appointment.enum';

const ACTIVE_STATUSES: ReadonlySet<EAppointmentStatus> = new Set([
  EAppointmentStatus.PENDING,
  EAppointmentStatus.CONFIRMED,
]);

export function isAppointmentDisplayActive(
  appointment: Pick<IAppointmentEntity, 'status'>,
): boolean {
  return ACTIVE_STATUSES.has(appointment.status);
}

/**
 * Активная ближайшая запись, иначе последняя по startsAt.
 */
export function resolveDisplayAppointment<T extends Pick<IAppointmentEntity, 'status' | 'startsAt'>>(
  appointments: readonly T[],
): T | null {
  if (appointments.length === 0) {
    return null;
  }

  const active = appointments.filter(isAppointmentDisplayActive);
  if (active.length > 0) {
    return [...active].sort(
      (a, b) => a.startsAt.getTime() - b.startsAt.getTime(),
    )[0];
  }

  return [...appointments].sort(
    (a, b) => b.startsAt.getTime() - a.startsAt.getTime(),
  )[0];
}
