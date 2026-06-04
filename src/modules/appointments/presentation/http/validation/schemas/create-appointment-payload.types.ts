import type { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment/appointment.enum';

export interface ICreateAppointmentPayload {
  masterProfileId: string;
  masterServiceId: string;
  clientUserId?: string;
  startsAt: string;
  status?: EAppointmentStatus;
  initialMessage?: { body: string };
}
