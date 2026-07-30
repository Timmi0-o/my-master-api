import type { ICompleteAppointmentApplicationInput } from 'src/modules/appointments/application/dtos/appointment/complete-appointment.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function requestParamsToCompleteAppointmentUseCaseInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): ICompleteAppointmentApplicationInput {
  return {
    id,
    actor: toAppointmentActor(sessionUser, isStaffUser),
  };
}
