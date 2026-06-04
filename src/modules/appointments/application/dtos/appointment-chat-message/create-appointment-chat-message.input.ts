import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';

export interface ICreateAppointmentChatMessageApplicationInput {
  chatId: string;
  body: string;
  actor: IAppointmentActorInput;
}
