import type { IAppointmentWithPeerPersonalNotes } from './appointment-with-peer-personal-notes.output';

export interface GetAppointmentsOutput {
  items: IAppointmentWithPeerPersonalNotes[];
  total: number;
}
