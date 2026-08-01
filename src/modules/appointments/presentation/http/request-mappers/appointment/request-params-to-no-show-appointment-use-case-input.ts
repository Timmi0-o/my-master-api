import type { INoShowAppointmentApplicationInput } from 'src/modules/appointments/application/dtos/appointment/no-show-appointment.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function requestParamsToNoShowAppointmentUseCaseInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): INoShowAppointmentApplicationInput {
  return {
    id,
    actor: toAppointmentActor(sessionUser, isStaffUser),
  };
}
