import type { IAppointmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment';

export interface GetAppointmentsOutput {
  items: IAppointmentPublicEntity[];
  total: number;
}
