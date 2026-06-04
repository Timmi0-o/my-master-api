import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';
import type { IUpdateAppointmentInput } from 'src/modules/appointments/domain/entities/appointment';

export interface IUpdateAppointmentApplicationInput {
  id: string;
  patch: IUpdateAppointmentInput;
  actor: IAppointmentActorInput;
}
