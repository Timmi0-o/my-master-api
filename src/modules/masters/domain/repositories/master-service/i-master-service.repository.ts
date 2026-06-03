import type { IReadRepository } from 'src/modules/shared/domain/repositories';
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
> & {
  findEntityById(id: string): Promise<IMasterServiceEntity | null>;
  create(input: ICreateMasterServiceInput): Promise<IMasterServiceEntity>;
  update(
    id: string,
    input: IUpdateMasterServiceInput,
  ): Promise<IMasterServiceEntity>;
  softDeleteById(id: string): Promise<boolean>;
};
