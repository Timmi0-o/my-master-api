import type { ICreateRepository } from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateImageInput,
  IImageEntity,
  IImagePublicEntity,
  ImageEntityType,
} from '../../entities/image';

export type IImageRepository = ICreateRepository<
  IImageEntity,
  ICreateImageInput
> & {
  findByEntity(
    entityType: ImageEntityType,
    entityId: string,
    scope?: TransactionScope,
  ): Promise<IImageEntity[]>;
  findByEntityAndFileIds(
    entityType: ImageEntityType,
    entityId: string,
    fileIds: readonly string[],
    scope?: TransactionScope,
  ): Promise<IImageEntity[]>;
  findByEntityTypeAndEntityIds(
    entityType: ImageEntityType,
    entityIds: readonly string[],
    options?: { includeFile?: boolean },
    scope?: TransactionScope,
  ): Promise<IImagePublicEntity[]>;
  deleteByEntityAndFileIds(
    entityType: ImageEntityType,
    entityId: string,
    fileIds: readonly string[],
    scope: TransactionScope,
  ): Promise<number>;
};
