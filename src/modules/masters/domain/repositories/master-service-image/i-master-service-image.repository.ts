import type { ICreateRepository } from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateMasterServiceImageInput,
  IMasterServiceImageEntity,
} from '../../entities/master-service-image';

export type IMasterServiceImageRepository = ICreateRepository<
  IMasterServiceImageEntity,
  ICreateMasterServiceImageInput
> & {
  findByMasterServiceId(
    masterServiceId: string,
    scope?: TransactionScope,
  ): Promise<IMasterServiceImageEntity[]>;
  findByMasterServiceIdAndFileIds(
    masterServiceId: string,
    fileIds: readonly string[],
    scope?: TransactionScope,
  ): Promise<IMasterServiceImageEntity[]>;
  deleteByMasterServiceIdAndFileIds(
    masterServiceId: string,
    fileIds: readonly string[],
    scope: TransactionScope,
  ): Promise<number>;
};
