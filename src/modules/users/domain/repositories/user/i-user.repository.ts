import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
  IUpdateRepository,
} from '@shared/domain/repositories';
import type { ISessionUser } from '@shared/domain/i-session-user';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateUserInput,
  IUpdateUserInput,
  IUserEntity,
  IUserPublicEntity,
} from '../../entities/user';

export type IUserRepository = IReadRepository<
  IUserPublicEntity,
  string,
  Record<never, never>
> &
  ICreateRepository<IUserEntity, ICreateUserInput> &
  ISoftDeleteRepository<IUserEntity, string> &
  IUpdateRepository<IUserEntity, string, IUpdateUserInput> & {
    findEntityById(
      userId: string,
      scope?: TransactionScope,
    ): Promise<IUserEntity | null>;
    findByEmail(email: string): Promise<IUserEntity | null>;
    findByEmailOrUsername(identifier: string): Promise<IUserEntity | null>;
    findSessionUserById(userId: string): Promise<ISessionUser | null>;
  };
