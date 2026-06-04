import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';
import type { FindOneParams } from 'src/modules/shared/domain/query';
import type {
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat';

export interface IGetAppointmentChatByIdApplicationInput {
  id: string;
  actor: IAppointmentActorInput;
  params: FindOneParams<IAppointmentChatPublicEntity, IAppointmentChatRelations>;
}
