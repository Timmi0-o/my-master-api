import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';

export interface IMarkAppointmentChatReadApplicationInput {
  id: string;
  lastReadAt: Date;
  actor: IAppointmentActorInput;
}
