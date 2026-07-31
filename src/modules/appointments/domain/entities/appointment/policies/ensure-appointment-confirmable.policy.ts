import type { IAppointmentEntity } from '../i-appointment.entity';
import { EAppointmentStatus } from '../appointment.enum';
import { AppointmentNotConfirmableError } from '../errors';

export function ensureAppointmentConfirmable(
  appointment: IAppointmentEntity,
): void {
  if (appointment.status !== EAppointmentStatus.PENDING) {
    throw new AppointmentNotConfirmableError(
      appointment.id,
      appointment.status,
    );
  }
}
