import type { IGetMyAppointmentsApplicationInput } from 'src/modules/appointments/application/dtos/appointment/get-my-appointments.input';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  IAppointmentPublicEntity,
  IAppointmentRelations,
} from 'src/modules/appointments/domain/entities/appointment';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function payloadToGetMyAppointmentsInput(
  params: FindManyParams<IAppointmentPublicEntity, IAppointmentRelations>,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetMyAppointmentsApplicationInput {
  return {
    actor: toAppointmentActor(sessionUser, isStaffUser),
    params,
  };
}
