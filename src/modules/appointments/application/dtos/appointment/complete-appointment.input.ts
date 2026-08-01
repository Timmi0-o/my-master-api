import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';

export interface ICompleteAppointmentApplicationInput {
  id: string;
  actor: IAppointmentActorInput;
  /** System cron after slot end — no early flags; notify both parties. */
  source?: 'user' | 'system';
}
