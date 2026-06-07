import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';

export interface IAssertAppointmentChatAccessApplicationInput {
  chatId: string;
  actor: IAppointmentActorInput;
}
