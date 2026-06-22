import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
  IUpdateRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateMasterProfileInput,
  IMasterProfileEntity,
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
  IUpdateMasterProfileInput,
} from '../../entities/master-profile';

export type IMasterProfileRepository = IReadRepository<
  IMasterProfilePublicEntity,
  string,
  IMasterProfileRelations
> &
  ICreateRepository<IMasterProfileEntity, ICreateMasterProfileInput> &
  IUpdateRepository<IMasterProfileEntity, string, IUpdateMasterProfileInput> &
  ISoftDeleteRepository<IMasterProfileEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<IMasterProfileEntity | null>;
    findEntityByUserId(
      userId: string,
      scope?: TransactionScope,
    ): Promise<IMasterProfileEntity | null>;
  };
