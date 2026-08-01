import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';

export interface IRescheduleAppointmentApplicationInput {
  id: string;
  startsAt: Date;
  actor: IAppointmentActorInput;
}
