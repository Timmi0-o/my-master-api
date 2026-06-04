import type { IAppointmentActorInput } from 'src/modules/appointments/application/dtos/common/i-appointment-actor.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';

export function toAppointmentActor(
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IAppointmentActorInput {
  return {
    userId: sessionUser.id,
    isStaffUser,
  };
}
