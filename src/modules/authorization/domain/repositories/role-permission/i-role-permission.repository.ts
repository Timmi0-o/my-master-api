import type { IReadRepository } from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  IGrantRolePermissionInput,
  IRolePermissionEntity,
  IRolePermissionPublicEntity,
  IRolePermissionRelations,
} from '../../entities/role-permission';

export type IRolePermissionRepository = IReadRepository<
  IRolePermissionPublicEntity,
  string,
  IRolePermissionRelations
> & {
  findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IRolePermissionEntity | null>;

  findByRoleIdAndPermissionId(
    roleId: string,
    permissionId: string,
    scope?: TransactionScope,
  ): Promise<IRolePermissionEntity | null>;

  grant(
    input: IGrantRolePermissionInput,
    scope: TransactionScope,
  ): Promise<IRolePermissionEntity>;

  revoke(
    roleId: string,
    permissionId: string,
    scope: TransactionScope,
  ): Promise<void>;
};
