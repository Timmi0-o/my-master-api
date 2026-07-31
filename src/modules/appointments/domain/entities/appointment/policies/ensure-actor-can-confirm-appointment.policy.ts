import { AppointmentForbiddenError } from '../errors';
import type { IAppointmentActor } from './appointment-actor.types';

/**
 * Confirm: master owner or staff.
 */
export function ensureActorCanConfirmAppointment(
  appointmentId: string,
  actor: IAppointmentActor,
  masterProfileUserId: string,
): void {
  if (actor.isStaffUser) {
    return;
  }
  if (masterProfileUserId === actor.userId) {
    return;
  }
  throw new AppointmentForbiddenError(appointmentId);
}
