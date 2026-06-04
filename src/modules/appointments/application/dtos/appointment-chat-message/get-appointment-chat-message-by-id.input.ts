import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';
import type { FindOneParams } from 'src/modules/shared/domain/query';
import type {
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';

export interface IGetAppointmentChatMessageByIdApplicationInput {
  id: string;
  actor: IAppointmentActorInput;
  params: FindOneParams<
    IAppointmentChatMessagePublicEntity,
    IAppointmentChatMessageRelations
  >;
}
