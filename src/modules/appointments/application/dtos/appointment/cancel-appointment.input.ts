import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';

export interface ICancelAppointmentApplicationInput {
  id: string;
  actor: IAppointmentActorInput;
  cancelReason?: string | null;
}
