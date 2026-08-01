import { EAppointmentStatus } from '../appointment.enum';
import type { IAppointmentEntity } from '../i-appointment.entity';

export const APPOINTMENT_IN_PROGRESS_STATUSES = [
  EAppointmentStatus.PENDING,
  EAppointmentStatus.CONFIRMED,
] as const;

/**
 * Запись «сейчас идёт»: активный статус и now внутри окна startsAt…startsAt+duration.
 */
export function isAppointmentInProgress(
  appointment: Pick<
    IAppointmentEntity,
    'status' | 'startsAt' | 'durationMinutes' | 'deletedAt'
  >,
  now: Date = new Date(),
): boolean {
  if (appointment.deletedAt != null) {
    return false;
  }

  if (
    appointment.status !== EAppointmentStatus.PENDING &&
    appointment.status !== EAppointmentStatus.CONFIRMED
  ) {
    return false;
  }

  const startsAtMs = appointment.startsAt.getTime();
  const endsAtMs = startsAtMs + appointment.durationMinutes * 60_000;
  const nowMs = now.getTime();

  return startsAtMs <= nowMs && nowMs < endsAtMs;
}
