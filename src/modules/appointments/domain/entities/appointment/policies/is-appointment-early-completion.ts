import type { IAppointmentEntity } from '../i-appointment.entity';

/**
 * Досрочное завершение: сейчас раньше окончания слота (startsAt + duration).
 */
export function isAppointmentEarlyCompletion(
  appointment: Pick<IAppointmentEntity, 'startsAt' | 'durationMinutes'>,
  now: Date = new Date(),
): boolean {
  const endsAtMs =
    appointment.startsAt.getTime() + appointment.durationMinutes * 60_000;
  return now.getTime() < endsAtMs;
}
