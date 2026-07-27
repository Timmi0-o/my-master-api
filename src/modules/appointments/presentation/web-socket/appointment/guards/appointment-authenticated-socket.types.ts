import type { Socket } from 'socket.io';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';

export interface IAppointmentAuthenticatedSocketData {
  user: ISessionUser;
}

export type AppointmentAuthenticatedSocket = Socket & {
  data: IAppointmentAuthenticatedSocketData;
};
