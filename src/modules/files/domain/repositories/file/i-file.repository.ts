import type { IReadRepository } from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateFileInput,
  IFileEntity,
  IFilePublicEntity,
  IUpdateFileInput,
} from '../../entities/file';

export type IFileRepository = IReadRepository<
  IFilePublicEntity,
  string,
  Record<never, never>
> & {
  findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IFileEntity | null>;
  findEntityByUrl(
    fileUrl: string,
    scope?: TransactionScope,
  ): Promise<IFileEntity | null>;
  findEntitiesByIds(
    ids: string[],
    scope?: TransactionScope,
  ): Promise<IFileEntity[]>;
  create(
    data: ICreateFileInput,
    scope?: TransactionScope,
  ): Promise<IFileEntity>;
  insertMany(
    data: ICreateFileInput[],
    scope?: TransactionScope,
  ): Promise<IFileEntity[]>;
  update(
    id: string,
    data: IUpdateFileInput,
    scope?: TransactionScope,
  ): Promise<IFileEntity>;
  softDeleteMany(ids: string[], scope?: TransactionScope): Promise<number>;
  softDeleteByFolderIds(
    folderIds: string[],
    scope?: TransactionScope,
  ): Promise<number>;
};
