import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, type ILogger } from '@shared/domain/logging/logger.token';
import type { ReadResult } from '@shared/domain/query';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  IPermissionEntity,
  IPermissionPublicEntity,
} from 'src/modules/authorization/domain/entities/permission';
import type { IPermissionRepository } from 'src/modules/authorization/domain/repositories/permission/i-permission.repository';
import { mapPermissionRow, type PermissionRow } from '../../row-mappers/permission';
import {
  PERMISSION_RELATIONS,
  PERMISSION_VALIDATION_CONFIG,
} from './permission.relations';

@Injectable()
export class PrismaPermissionRepository
  extends PrismaReadRepository<
    IPermissionPublicEntity,
    string,
    Record<never, never>,
    PermissionRow
  >
  implements IPermissionRepository
{
  protected readonly validationConfig = PERMISSION_VALIDATION_CONFIG;
  protected readonly relationConfig = PERMISSION_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).permission
      : this.prismaService.permission;
  }

  protected mapRow(
    row: PermissionRow,
  ): ReadResult<IPermissionPublicEntity, Record<never, never>> {
    return mapPermissionRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    permissionId: string,
    scope?: TransactionScope,
  ): Promise<IPermissionEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id: permissionId },
    });

    return row ? mapPermissionRow(row as PermissionRow) : null;
  }

  async findByName(
    name: string,
    scope?: TransactionScope,
  ): Promise<IPermissionEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { name },
    });

    return row ? mapPermissionRow(row as PermissionRow) : null;
  }
}
