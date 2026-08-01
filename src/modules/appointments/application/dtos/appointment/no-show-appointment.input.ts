import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';

export interface INoShowAppointmentApplicationInput {
  id: string;
  actor: IAppointmentActorInput;
}
