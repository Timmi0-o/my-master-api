import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
  IUpdateRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateUserProfileInput,
  IUpdateUserProfileInput,
  IUserProfileEntity,
  IUserProfilePublicEntity,
} from '../../entities/user-profile';

export type IUserProfileRepository = IReadRepository<
  IUserProfilePublicEntity,
  string,
  Record<never, never>
> &
  ICreateRepository<IUserProfileEntity, ICreateUserProfileInput> &
  IUpdateRepository<IUserProfileEntity, string, IUpdateUserProfileInput> &
  ISoftDeleteRepository<IUserProfileEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<IUserProfileEntity | null>;
    findEntityByUserId(
      userId: string,
      scope?: TransactionScope,
    ): Promise<IUserProfileEntity | null>;
  };
