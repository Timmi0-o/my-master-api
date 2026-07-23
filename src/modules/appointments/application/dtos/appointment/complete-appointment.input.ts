import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';

export interface ICompleteAppointmentApplicationInput {
  id: string;
  actor: IAppointmentActorInput;
}
