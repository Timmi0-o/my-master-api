import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IListQueryParams } from 'src/modules/shared/domain/list-query.params';

import {
  ICreateUserInput,
  IUserEntity,
  IUserPublicEntity,
} from '../../entities/user';

export interface IUserRepository {
  create(user: ICreateUserInput): Promise<IUserEntity>;
  findById(userId: string): Promise<IUserEntity | null>;
  findByEmail(email: string): Promise<IUserEntity | null>;
  findByEmailOrUsername(identifier: string): Promise<IUserEntity | null>;
  findSessionUserById(userId: string): Promise<ISessionUser | null>;
  createRefreshToken(payload: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<{
    id: string;
    userId: string;
    tokenHash: string;
    revokedAt: Date | null;
  }>;
  findRefreshTokenByHash(tokenHash: string): Promise<{
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null>;
  revokeRefreshTokenById(tokenId: string): Promise<void>;
  revokeAllRefreshTokensForUser(userId: string): Promise<void>;
  createSession(payload: {
    userId: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<void>;
  findManyAndCountForList(
    params: IListQueryParams,
  ): Promise<[IUserPublicEntity[] | null, number]>;
  softDeleteById(userId: string): Promise<boolean>;
}
