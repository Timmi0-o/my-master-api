import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';

export interface IJwtAccessPayload {
  sub: string;
  email: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface IRefreshPayload {
  refreshToken: string;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse {
  user: ISessionUser;
  tokens: ITokenPair;
}
