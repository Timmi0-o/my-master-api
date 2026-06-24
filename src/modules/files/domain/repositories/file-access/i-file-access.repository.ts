import type { TransactionScope } from '@shared/domain/transactions';
import type {
  FileAccessTargetType,
  IFileAccessEntity,
  ICreateFileAccessInput,
} from '../../entities/file-access/i-file-access.entity';

export interface IFileAccessRepository {
  findById(id: string, scope?: TransactionScope): Promise<IFileAccessEntity | null>;
  findByFileIdAndTarget(
    fileId: string,
    targetType: FileAccessTargetType,
    targetId: string,
    scope?: TransactionScope,
  ): Promise<IFileAccessEntity | null>;
  findByFileId(fileId: string, scope?: TransactionScope): Promise<IFileAccessEntity[]>;
  create(
    data: ICreateFileAccessInput,
    scope?: TransactionScope,
  ): Promise<IFileAccessEntity>;
  delete(id: string, scope?: TransactionScope): Promise<void>;
}
