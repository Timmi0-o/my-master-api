import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateFileShareInput,
  IFileShareEntity,
} from '../../entities/file-share/i-file-share.entity';

export interface IFileShareRepository {
  findById(id: string, scope?: TransactionScope): Promise<IFileShareEntity | null>;
  findByToken(token: string, scope?: TransactionScope): Promise<IFileShareEntity | null>;
  findByFileId(fileId: string, scope?: TransactionScope): Promise<IFileShareEntity[]>;
  create(
    data: ICreateFileShareInput,
    scope?: TransactionScope,
  ): Promise<IFileShareEntity>;
  update(
    id: string,
    data: Partial<
      Pick<
        IFileShareEntity,
        'downloads' | 'views' | 'lastAccessAt' | 'password'
      >
    >,
    scope?: TransactionScope,
  ): Promise<IFileShareEntity>;
  delete(id: string, scope?: TransactionScope): Promise<void>;
}
