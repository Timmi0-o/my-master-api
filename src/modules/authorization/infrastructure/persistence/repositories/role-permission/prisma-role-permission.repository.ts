import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, type ILogger } from '@shared/domain/logging/logger.token';
import type { ReadResult } from '@shared/domain/query';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  IGrantRolePermissionInput,
  IRolePermissionEntity,
  IRolePermissionPublicEntity,
  IRolePermissionRelations,
} from 'src/modules/authorization/domain/entities/role-permission';
import type { IRolePermissionRepository } from 'src/modules/authorization/domain/repositories/role-permission/i-role-permission.repository';
import {
  mapRolePermissionRow,
  type RolePermissionRow,
} from '../../row-mappers/role-permission';
import {
  ROLE_PERMISSION_RELATIONS,
  ROLE_PERMISSION_VALIDATION_CONFIG,
} from './role-permission.relations';
import { mapRolePermissionWriteError } from './role-permission-write-error.mapper';

@Injectable()
export class PrismaRolePermissionRepository
  extends PrismaReadRepository<
    IRolePermissionPublicEntity,
    string,
    IRolePermissionRelations,
    RolePermissionRow
  >
  implements IRolePermissionRepository
{
  protected readonly validationConfig = ROLE_PERMISSION_VALIDATION_CONFIG;
  protected readonly relationConfig = ROLE_PERMISSION_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).rolePermission
      : this.prismaService.rolePermission;
  }

  protected mapRow(
    row: RolePermissionRow,
  ): ReadResult<IRolePermissionPublicEntity, IRolePermissionRelations> {
    return mapRolePermissionRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IRolePermissionEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });

    return row ? mapRolePermissionRow(row as RolePermissionRow) : null;
  }

  async findByRoleIdAndPermissionId(
    roleId: string,
    permissionId: string,
    scope?: TransactionScope,
  ): Promise<IRolePermissionEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });

    return row ? mapRolePermissionRow(row as RolePermissionRow) : null;
  }

  async grant(
    input: IGrantRolePermissionInput,
    scope: TransactionScope,
  ): Promise<IRolePermissionEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.rolePermission.create({
        data: {
          roleId: input.roleId,
          permissionId: input.permissionId,
        },
      });

      return mapRolePermissionRow(row as RolePermissionRow);
    } catch (error) {
      throw mapRolePermissionWriteError(error, {
        roleId: input.roleId,
        permissionId: input.permissionId,
      });
    }
  }

  async revoke(
    roleId: string,
    permissionId: string,
    scope: TransactionScope,
  ): Promise<void> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      await tx.rolePermission.delete({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
      });
    } catch (error) {
      throw mapRolePermissionWriteError(error, { roleId, permissionId });
    }
  }
}
