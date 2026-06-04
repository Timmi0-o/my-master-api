import type { IDeleteAppointmentApplicationInput } from 'src/modules/appointments/application/dtos/appointment/delete-appointment.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function payloadToDeleteAppointmentInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteAppointmentApplicationInput {
  return {
    id,
    actor: toAppointmentActor(sessionUser, isStaffUser),
  };
}
