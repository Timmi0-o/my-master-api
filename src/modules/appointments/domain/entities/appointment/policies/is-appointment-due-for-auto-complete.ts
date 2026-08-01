import type { IAppointmentEntity } from '../i-appointment.entity';
import { EAppointmentStatus } from '../appointment.enum';

export function getAppointmentEndsAt(
  appointment: Pick<IAppointmentEntity, 'startsAt' | 'durationMinutes'>,
): Date {
  return new Date(
    appointment.startsAt.getTime() + appointment.durationMinutes * 60_000,
  );
}

export function isAppointmentDueForAutoComplete(
  appointment: Pick<
    IAppointmentEntity,
    'status' | 'startsAt' | 'durationMinutes' | 'deletedAt'
  >,
  now: Date = new Date(),
): boolean {
  if (appointment.deletedAt != null) {
    return false;
  }

  if (appointment.status !== EAppointmentStatus.CONFIRMED) {
    return false;
  }

  return now.getTime() >= getAppointmentEndsAt(appointment).getTime();
}
