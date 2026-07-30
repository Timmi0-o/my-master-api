import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  ICreateUserPersonalNoteInput,
  IUpdateUserPersonalNoteInput,
  IUserPersonalNoteEntity,
} from 'src/modules/users/domain/entities/user-personal-note';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import {
  mapUserPersonalNoteRow,
  type UserPersonalNoteRow,
} from '../../row-mappers/user-personal-note';
import { mapUserPersonalNoteWriteError } from './user-personal-note-write-error.mapper';

@Injectable()
export class PrismaUserPersonalNoteRepository
  implements IUserPersonalNoteRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  private getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).userPersonalNote
      : this.prismaService.userPersonalNote;
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IUserPersonalNoteEntity | null> {
    const row = await this.getDelegate(scope).findUnique({ where: { id } });
    return row ? mapUserPersonalNoteRow(row as UserPersonalNoteRow) : null;
  }

  async findEntityByOwnerAndReference(
    ownerUserId: string,
    referenceUserId: string,
    scope?: TransactionScope,
  ): Promise<IUserPersonalNoteEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: {
        ownerUserId_referenceUserId: { ownerUserId, referenceUserId },
      },
    });
    return row ? mapUserPersonalNoteRow(row as UserPersonalNoteRow) : null;
  }

  async findActiveByOwnerAndReferenceUserIds(
    ownerUserId: string,
    referenceUserIds: readonly string[],
    scope?: TransactionScope,
  ): Promise<IUserPersonalNoteEntity[]> {
    if (referenceUserIds.length === 0) {
      return [];
    }

    const rows = await this.getDelegate(scope).findMany({
      where: {
        ownerUserId,
        referenceUserId: { in: [...referenceUserIds] },
        deletedAt: null,
      },
    });

    return rows.map((row) => mapUserPersonalNoteRow(row as UserPersonalNoteRow));
  }

  async create(
    input: ICreateUserPersonalNoteInput,
    scope: TransactionScope,
  ): Promise<IUserPersonalNoteEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.userPersonalNote.create({
        data: {
          ownerUserId: input.ownerUserId,
          referenceUserId: input.referenceUserId,
          names: input.names as Prisma.InputJsonValue,
          notes:
            input.notes === undefined || input.notes === null
              ? undefined
              : (input.notes as Prisma.InputJsonValue),
        },
      });
      return mapUserPersonalNoteRow(row as UserPersonalNoteRow);
    } catch (error) {
      throw mapUserPersonalNoteWriteError(error, {
        ownerUserId: input.ownerUserId,
        referenceUserId: input.referenceUserId,
      });
    }
  }

  async update(
    id: string,
    patch: IUpdateUserPersonalNoteInput,
    scope: TransactionScope,
  ): Promise<IUserPersonalNoteEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.userPersonalNote.update({
        where: { id },
        data: {
          names: patch.names as Prisma.InputJsonValue,
          notes:
            patch.notes === undefined
              ? undefined
              : patch.notes === null
                ? Prisma.DbNull
                : (patch.notes as Prisma.InputJsonValue),
          ...(patch.deletedAt !== undefined
            ? { deletedAt: patch.deletedAt }
            : {}),
        },
      });
      return mapUserPersonalNoteRow(row as UserPersonalNoteRow);
    } catch (error) {
      throw mapUserPersonalNoteWriteError(error, { id });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IUserPersonalNoteEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.userPersonalNote.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapUserPersonalNoteRow(row as UserPersonalNoteRow);
    } catch (error) {
      throw mapUserPersonalNoteWriteError(error, { id });
    }
  }
}
