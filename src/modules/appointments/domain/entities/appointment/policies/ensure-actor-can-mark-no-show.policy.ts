import { AppointmentForbiddenError } from '../errors';
import type { IAppointmentActor } from './appointment-actor.types';

/**
 * NO_SHOW: master owner or staff only.
 */
export function ensureActorCanMarkNoShow(
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
