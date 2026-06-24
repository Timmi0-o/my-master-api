import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateFolderInput,
  IFolderEntity,
  IUpdateFolderInput,
} from '../../entities/folder';

export interface IFolderRepository {
  findById(id: string, scope?: TransactionScope): Promise<IFolderEntity | null>;
  findByOwnerAndPath(
    ownerKind: string,
    ownerId: string,
    path: string,
    scope?: TransactionScope,
  ): Promise<IFolderEntity | null>;
  findManyByOwner(
    ownerKind: string,
    ownerId: string,
    scope?: TransactionScope,
  ): Promise<IFolderEntity[]>;
  findIdsByPathPrefix(
    ownerKind: string,
    ownerId: string,
    pathPrefix: string,
    scope?: TransactionScope,
  ): Promise<string[]>;
  create(data: ICreateFolderInput, scope?: TransactionScope): Promise<IFolderEntity>;
  update(
    id: string,
    data: IUpdateFolderInput,
    scope?: TransactionScope,
  ): Promise<IFolderEntity>;
  updateMany(
    ids: string[],
    data: IUpdateFolderInput,
    scope?: TransactionScope,
  ): Promise<number>;
  softDeleteMany(ids: string[], scope?: TransactionScope): Promise<number>;
}
