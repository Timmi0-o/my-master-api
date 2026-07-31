import type { IConfirmAppointmentApplicationInput } from 'src/modules/appointments/application/dtos/appointment/confirm-appointment.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function requestParamsToConfirmAppointmentUseCaseInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IConfirmAppointmentApplicationInput {
  return {
    id,
    actor: toAppointmentActor(sessionUser, isStaffUser),
  };
}
