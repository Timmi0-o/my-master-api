import type {
  IRevokeRolePermissionApplicationInput,
  IRevokeRolePermissionApplicationOutput,
} from '../../dtos/role-permission/revoke-role-permission.output';
import { PermissionNotFoundError } from 'src/modules/authorization/domain/entities/permission';
import { RoleNotFoundError } from 'src/modules/authorization/domain/entities/role';
import { RolePermissionNotFoundError } from 'src/modules/authorization/domain/entities/role-permission';
import type { IPermissionRepository } from 'src/modules/authorization/domain/repositories/permission/i-permission.repository';
import type { IRolePermissionRepository } from 'src/modules/authorization/domain/repositories/role-permission/i-role-permission.repository';
import type { IRoleRepository } from 'src/modules/authorization/domain/repositories/role/i-role.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class RevokeRolePermissionUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly roleRepository: IRoleRepository,
    private readonly permissionRepository: IPermissionRepository,
    private readonly rolePermissionRepository: IRolePermissionRepository,
  ) {}

  async execute(
    input: IRevokeRolePermissionApplicationInput,
  ): Promise<IRevokeRolePermissionApplicationOutput> {
    const [role, permission, existing] = await Promise.all([
      this.roleRepository.findEntityById(input.roleId),
      this.permissionRepository.findEntityById(input.permissionId),
      this.rolePermissionRepository.findByRoleIdAndPermissionId(
        input.roleId,
        input.permissionId,
      ),
    ]);

    if (!role) {
      throw new RoleNotFoundError(input.roleId);
    }

    if (!permission) {
      throw new PermissionNotFoundError(input.permissionId);
    }

    if (!existing) {
      throw new RolePermissionNotFoundError(input.roleId, input.permissionId);
    }

    await this.transactionManager.runInTransaction((scope) =>
      this.rolePermissionRepository.revoke(
        input.roleId,
        input.permissionId,
        scope,
      ),
    );
  }
}
