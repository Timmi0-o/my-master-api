import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';
import type { FindOneParams } from 'src/modules/shared/domain/query';
import type {
  IAppointmentPublicEntity,
  IAppointmentRelations,
} from 'src/modules/appointments/domain/entities/appointment';

export interface IGetAppointmentByIdApplicationInput {
  id: string;
  actor: IAppointmentActorInput;
  params: FindOneParams<IAppointmentPublicEntity, IAppointmentRelations>;
}
