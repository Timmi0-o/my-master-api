import type { FindManyParams } from '@shared/domain/query';
import type {
  IGetRolePermissionsApplicationInput,
  IGetRolePermissionsApplicationOutput,
} from '../../dtos/role-permission/get-role-permissions.output';
import {
  type IRolePermissionPublicEntity,
  type IRolePermissionRelations,
} from 'src/modules/authorization/domain/entities/role-permission';
import { RoleNotFoundError } from 'src/modules/authorization/domain/entities/role';
import type { IRolePermissionRepository } from 'src/modules/authorization/domain/repositories/role-permission/i-role-permission.repository';
import type { IRoleRepository } from 'src/modules/authorization/domain/repositories/role/i-role.repository';

export class GetRolePermissionsUseCase {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly rolePermissionRepository: IRolePermissionRepository,
  ) {}

  async execute(
    input: IGetRolePermissionsApplicationInput,
  ): Promise<IGetRolePermissionsApplicationOutput> {
    const role = await this.roleRepository.findEntityById(input.roleId);

    if (!role) {
      throw new RoleNotFoundError(input.roleId);
    }

    const where = {
      ...(input.params?.where ?? {}),
      roleId: { equals: input.roleId },
    };

    const params = {
      ...input.params,
      where,
      selectOptions: {
        ...input.params?.selectOptions,
        include: {
          permission: true,
        },
      },
    } as FindManyParams<IRolePermissionPublicEntity, IRolePermissionRelations>;

    const [rolePermissions, total] = await Promise.all([
      this.rolePermissionRepository.findMany(params),
      this.rolePermissionRepository.count({ where }),
    ]);

    const items = rolePermissions
      .map((entry) => entry.permission)
      .filter((permission): permission is NonNullable<typeof permission> =>
        Boolean(permission),
      );

    return { items, total };
  }
}
