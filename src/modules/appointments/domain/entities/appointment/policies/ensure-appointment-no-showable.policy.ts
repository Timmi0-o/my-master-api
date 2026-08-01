import type { IAppointmentEntity } from '../i-appointment.entity';
import { EAppointmentStatus } from '../appointment.enum';
import { AppointmentNotNoShowableError } from '../errors/appointment-not-no-showable.error';
import {
  getAppointmentNoShowEligibleAt,
  isAppointmentNoShowEligible,
} from './is-appointment-no-show-eligible';

export function ensureAppointmentNoShowable(
  appointment: IAppointmentEntity,
  now: Date = new Date(),
): void {
  if (appointment.status !== EAppointmentStatus.CONFIRMED) {
    throw new AppointmentNotNoShowableError(appointment.id, 'status', {
      status: appointment.status,
    });
  }

  if (!isAppointmentNoShowEligible(appointment, now)) {
    throw new AppointmentNotNoShowableError(appointment.id, 'too_early', {
      eligibleAt: getAppointmentNoShowEligibleAt(appointment).toISOString(),
    });
  }
}
