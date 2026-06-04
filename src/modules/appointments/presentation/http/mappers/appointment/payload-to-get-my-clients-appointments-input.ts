import type { IGetMyClientsAppointmentsApplicationInput } from 'src/modules/appointments/application/dtos/appointment/get-my-clients-appointments.input';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  IAppointmentPublicEntity,
  IAppointmentRelations,
} from 'src/modules/appointments/domain/entities/appointment';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function payloadToGetMyClientsAppointmentsInput(
  params: FindManyParams<IAppointmentPublicEntity, IAppointmentRelations>,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetMyClientsAppointmentsApplicationInput {
  return {
    actor: toAppointmentActor(sessionUser, isStaffUser),
    params,
  };
}
