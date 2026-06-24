import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, type ILogger } from '@shared/domain/logging/logger.token';
import type { ReadResult } from '@shared/domain/query';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type { IRoleEntity, IRolePublicEntity } from 'src/modules/authorization/domain/entities/role';
import type { IRoleRepository } from 'src/modules/authorization/domain/repositories/role/i-role.repository';
import { mapRoleRow, type RoleRow } from '../../row-mappers/role';
import { ROLE_RELATIONS, ROLE_VALIDATION_CONFIG } from './role.relations';

@Injectable()
export class PrismaRoleRepository
  extends PrismaReadRepository<
    IRolePublicEntity,
    string,
    Record<never, never>,
    RoleRow
  >
  implements IRoleRepository
{
  protected readonly validationConfig = ROLE_VALIDATION_CONFIG;
  protected readonly relationConfig = ROLE_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).role
      : this.prismaService.role;
  }

  protected mapRow(row: RoleRow): ReadResult<IRolePublicEntity, Record<never, never>> {
    return mapRoleRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    roleId: string,
    scope?: TransactionScope,
  ): Promise<IRoleEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id: roleId },
    });

    return row ? mapRoleRow(row as RoleRow) : null;
  }
}
