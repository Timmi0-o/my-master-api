import type { IReadRepository } from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  IPermissionEntity,
  IPermissionPublicEntity,
} from '../../entities/permission';

export type IPermissionRepository = IReadRepository<
  IPermissionPublicEntity,
  string,
  Record<never, never>
> & {
  findEntityById(
    permissionId: string,
    scope?: TransactionScope,
  ): Promise<IPermissionEntity | null>;

  findByName(name: string, scope?: TransactionScope): Promise<IPermissionEntity | null>;
};
