import type { ReadResult } from 'src/modules/shared/domain/query';
import type {
  IAppointmentPublicEntity,
  IAppointmentRelations,
} from '../appointment';
import type { IAppointmentChatMessagePublicEntity } from '../appointment-chat-message';

export type IAppointmentChatRelations = {
  appointment: ReadResult<IAppointmentPublicEntity, IAppointmentRelations>;
  messages?: IAppointmentChatMessagePublicEntity[];
};
