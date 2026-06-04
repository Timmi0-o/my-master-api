import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  IAppointmentPublicEntity,
  IAppointmentRelations,
} from 'src/modules/appointments/domain/entities/appointment';

export interface IGetMyClientsAppointmentsApplicationInput {
  actor: IAppointmentActorInput;
  params: FindManyParams<IAppointmentPublicEntity, IAppointmentRelations>;
}
