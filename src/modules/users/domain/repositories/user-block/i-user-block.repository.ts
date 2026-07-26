import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateUserBlockInput,
  IUserBlockEntity,
  IUserBlockPublicEntity,
  IUserBlockRelations,
} from '../../entities/user-block';

export type IUserBlockRepository = IReadRepository<
  IUserBlockPublicEntity,
  string,
  IUserBlockRelations
> &
  ICreateRepository<IUserBlockEntity, ICreateUserBlockInput> &
  ISoftDeleteRepository<IUserBlockEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<IUserBlockEntity | null>;
    findEntityByBlockerAndBlocked(
      blockerUserId: string,
      blockedUserId: string,
      scope?: TransactionScope,
    ): Promise<IUserBlockEntity | null>;
    existsActiveBetweenUsers(
      userIdA: string,
      userIdB: string,
      scope?: TransactionScope,
    ): Promise<boolean>;
    restore(
      id: string,
      scope: TransactionScope,
    ): Promise<IUserBlockEntity>;
  };
