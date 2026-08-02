import type { Socket } from 'socket.io';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';

export interface ICallAuthenticatedSocketData {
  user: ISessionUser;
}

export type CallAuthenticatedSocket = Socket & {
  data: ICallAuthenticatedSocketData;
};
