import type { IAppointmentEntity } from '../i-appointment.entity';
import { AppointmentForbiddenError } from '../errors';
import type { IAppointmentActor } from './appointment-actor.types';

/** Reschedule: client, master owner, or staff (same as cancel). */
export function ensureActorCanRescheduleAppointment(
  appointment: IAppointmentEntity,
  actor: IAppointmentActor,
  masterProfileUserId: string,
): void {
  if (actor.isStaffUser) {
    return;
  }
  if (appointment.clientUserId === actor.userId) {
    return;
  }
  if (masterProfileUserId === actor.userId) {
    return;
  }
  throw new AppointmentForbiddenError(appointment.id);
}
