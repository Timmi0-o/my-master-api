import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';
import type { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment';

export interface ICreateAppointmentApplicationInput {
  masterProfileId: string;
  masterServiceId: string;
  clientUserId?: string;
  startsAt: Date;
  status?: EAppointmentStatus;
  initialMessage?: { body: string };
  actor: IAppointmentActorInput;
}
