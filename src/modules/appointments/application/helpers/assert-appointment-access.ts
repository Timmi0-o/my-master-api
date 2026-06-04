import type { IAppointmentActorInput } from '../dtos/common/i-appointment-actor.input';
import type { IAppointmentEntity } from '../../domain/entities/appointment';
import { AppointmentForbiddenError } from '../../domain/errors/appointment-forbidden.error';

export function assertAppointmentAccess(
  appointment: IAppointmentEntity,
  actor: IAppointmentActorInput,
  masterProfileUserId: string,
): void {
  if (actor.isStaffUser) return;
  if (appointment.clientUserId === actor.userId) return;
  if (masterProfileUserId === actor.userId) return;
  throw new AppointmentForbiddenError(appointment.id);
}
