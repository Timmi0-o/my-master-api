import type { Socket } from 'socket.io';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';

export interface IAppointmentChatAuthenticatedSocketData {
  user: ISessionUser;
}

export type AppointmentChatAuthenticatedSocket = Socket & {
  data: IAppointmentChatAuthenticatedSocketData;
};
