import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';

export interface IEditAppointmentChatMessageApplicationInput {
  id: string;
  body: string;
  actor: IAppointmentActorInput;
}
