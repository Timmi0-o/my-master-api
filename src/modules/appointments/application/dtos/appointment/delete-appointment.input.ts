import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';

export interface IDeleteAppointmentApplicationInput {
  id: string;
  actor: IAppointmentActorInput;
}
