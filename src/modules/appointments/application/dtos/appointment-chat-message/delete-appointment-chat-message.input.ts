import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';
import type { EAppointmentChatMessageDeleteMode } from 'src/modules/appointments/domain/entities/appointment-chat-message';

export interface IDeleteAppointmentChatMessageApplicationInput {
  id: string;
  mode: EAppointmentChatMessageDeleteMode;
  actor: IAppointmentActorInput;
}
