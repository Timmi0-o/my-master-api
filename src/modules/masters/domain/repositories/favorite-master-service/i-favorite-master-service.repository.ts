import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateFavoriteMasterServiceInput,
  IFavoriteMasterServiceEntity,
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations,
} from '../../entities/favorite-master-service';

export type IFavoriteMasterServiceRepository = IReadRepository<
  IFavoriteMasterServicePublicEntity,
  string,
  IFavoriteMasterServiceRelations
> &
  ICreateRepository<
    IFavoriteMasterServiceEntity,
    ICreateFavoriteMasterServiceInput
  > &
  ISoftDeleteRepository<IFavoriteMasterServiceEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<IFavoriteMasterServiceEntity | null>;
    findEntityByUserAndMasterServiceId(
      userId: string,
      masterServiceId: string,
      scope?: TransactionScope,
    ): Promise<IFavoriteMasterServiceEntity | null>;
    restore(
      id: string,
      scope: TransactionScope,
    ): Promise<IFavoriteMasterServiceEntity>;
  };
