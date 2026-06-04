import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';

export interface IDeleteAppointmentChatApplicationInput {
  id: string;
  actor: IAppointmentActorInput;
}
