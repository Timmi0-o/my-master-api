import { Inject, Injectable } from '@nestjs/common';
import {
  LOGGER_TOKEN,
  type ILogger,
} from '@shared/domain/logging/logger.token';
import type { ReadResult } from '@shared/domain/query';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  ICreateUserBlockInput,
  IUserBlockEntity,
  IUserBlockPublicEntity,
  IUserBlockRelations,
} from 'src/modules/users/domain/entities/user-block';
import type { IUserBlockRepository } from 'src/modules/users/domain/repositories/user-block/i-user-block.repository';
import {
  mapUserBlockRow,
  type UserBlockRow,
} from '../../row-mappers/user-block';
import { mapUserBlockWriteError } from './user-block-write-error.mapper';
import {
  USER_BLOCK_RELATIONS,
  USER_BLOCK_VALIDATION_CONFIG,
} from './user-block.relations';

@Injectable()
export class PrismaUserBlockRepository
  extends PrismaReadRepository<
    IUserBlockPublicEntity,
    string,
    IUserBlockRelations,
    UserBlockRow
  >
  implements IUserBlockRepository
{
  protected readonly validationConfig = USER_BLOCK_VALIDATION_CONFIG;
  protected readonly relationConfig = USER_BLOCK_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).userBlock
      : this.prismaService.userBlock;
  }

  protected mapRow(
    row: UserBlockRow,
  ): ReadResult<IUserBlockPublicEntity, IUserBlockRelations> {
    return mapUserBlockRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IUserBlockEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row ? mapUserBlockRow(row as UserBlockRow) : null;
  }

  async findEntityByBlockerAndBlocked(
    blockerUserId: string,
    blockedUserId: string,
    scope?: TransactionScope,
  ): Promise<IUserBlockEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: {
        blockerUserId_blockedUserId: { blockerUserId, blockedUserId },
      },
    });
    return row ? mapUserBlockRow(row as UserBlockRow) : null;
  }

  async existsActiveBetweenUsers(
    userIdA: string,
    userIdB: string,
    scope?: TransactionScope,
  ): Promise<boolean> {
    const row = await this.getDelegate(scope).findFirst({
      where: {
        deletedAt: null,
        OR: [
          { blockerUserId: userIdA, blockedUserId: userIdB },
          { blockerUserId: userIdB, blockedUserId: userIdA },
        ],
      },
      select: { id: true },
    });

    return row != null;
  }

  async create(
    input: ICreateUserBlockInput,
    scope: TransactionScope,
  ): Promise<IUserBlockEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.userBlock.create({ data: input });
      return mapUserBlockRow(row as UserBlockRow);
    } catch (error) {
      throw mapUserBlockWriteError(error, {
        blockerUserId: input.blockerUserId,
        blockedUserId: input.blockedUserId,
      });
    }
  }

  async createMany(
    inputs: readonly ICreateUserBlockInput[],
    scope: TransactionScope,
  ): Promise<IUserBlockEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.userBlock.createManyAndReturn({
        data: [...inputs],
      });
      return rows.map((row) => mapUserBlockRow(row as UserBlockRow));
    } catch (error) {
      const first = inputs[0];
      throw mapUserBlockWriteError(error, {
        blockerUserId: first.blockerUserId,
        blockedUserId: first.blockedUserId,
      });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IUserBlockEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.userBlock.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapUserBlockRow(row as UserBlockRow);
    } catch (error) {
      throw mapUserBlockWriteError(error, { id });
    }
  }

  async restore(
    id: string,
    scope: TransactionScope,
  ): Promise<IUserBlockEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.userBlock.update({
        where: { id },
        data: { deletedAt: null },
      });
      return mapUserBlockRow(row as UserBlockRow);
    } catch (error) {
      throw mapUserBlockWriteError(error, { id });
    }
  }
}
