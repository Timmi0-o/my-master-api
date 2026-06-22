import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
} from '@shared/domain/repositories';
import type { ISessionUser } from '@shared/domain/i-session-user';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateUserInput,
  IUserEntity,
  IUserPublicEntity,
} from '../../entities/user';

export type IUserRepository = IReadRepository<
  IUserPublicEntity,
  string,
  Record<never, never>
> &
  ICreateRepository<IUserEntity, ICreateUserInput> &
  ISoftDeleteRepository<IUserEntity, string> & {
    findEntityById(
      userId: string,
      scope?: TransactionScope,
    ): Promise<IUserEntity | null>;
    findByEmail(email: string): Promise<IUserEntity | null>;
    findByEmailOrUsername(identifier: string): Promise<IUserEntity | null>;
    findSessionUserById(userId: string): Promise<ISessionUser | null>;
  };
