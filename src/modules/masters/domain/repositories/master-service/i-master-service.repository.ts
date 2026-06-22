import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
  IUpdateRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateMasterServiceInput,
  IMasterServiceEntity,
  IMasterServicePublicEntity,
  IMasterServiceRelations,
  IUpdateMasterServiceInput,
} from '../../entities/master-service';

export type IMasterServiceRepository = IReadRepository<
  IMasterServicePublicEntity,
  string,
  IMasterServiceRelations
> &
  ICreateRepository<IMasterServiceEntity, ICreateMasterServiceInput> &
  IUpdateRepository<IMasterServiceEntity, string, IUpdateMasterServiceInput> &
  ISoftDeleteRepository<IMasterServiceEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<IMasterServiceEntity | null>;
  };
