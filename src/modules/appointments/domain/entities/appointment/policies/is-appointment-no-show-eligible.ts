import type { IAppointmentEntity } from '../i-appointment.entity';
import { EAppointmentStatus } from '../appointment.enum';
import { NO_SHOW_LATE_MS } from '../appointment-no-show.constants';

export function getAppointmentNoShowEligibleAt(
  appointment: Pick<IAppointmentEntity, 'startsAt'>,
): Date {
  return new Date(appointment.startsAt.getTime() + NO_SHOW_LATE_MS);
}

export function isAppointmentNoShowEligible(
  appointment: Pick<IAppointmentEntity, 'status' | 'startsAt'>,
  now: Date = new Date(),
): boolean {
  if (appointment.status !== EAppointmentStatus.CONFIRMED) {
    return false;
  }

  return now.getTime() >= getAppointmentNoShowEligibleAt(appointment).getTime();
}
