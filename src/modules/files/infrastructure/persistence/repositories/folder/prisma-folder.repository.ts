import { Injectable } from '@nestjs/common';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import type {
  ICreateFolderInput,
  IUpdateFolderInput,
} from '../../../../domain/entities/folder';
import type { IFolderRepository } from '../../../../domain/repositories/folder/i-folder.repository';
import { mapFolderRow } from '../../row-mappers/folder/folder.row-mapper';

@Injectable()
export class PrismaFolderRepository implements IFolderRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).folder
      : this.prisma.folder;
  }

  async findById(id: string, scope?: TransactionScope) {
    const row = await this.getDelegate(scope).findUnique({ where: { id } });
    return row ? mapFolderRow(row) : null;
  }

  async findByOwnerAndPath(
    ownerKind: string,
    ownerId: string,
    path: string,
    scope?: TransactionScope,
  ) {
    const row = await this.getDelegate(scope).findFirst({
      where: { ownerKind, ownerId, path, deletedAt: null },
    });
    return row ? mapFolderRow(row) : null;
  }

  async findManyByOwner(ownerKind: string, ownerId: string, scope?: TransactionScope) {
    const rows = await this.getDelegate(scope).findMany({
      where: { ownerKind, ownerId, deletedAt: null },
      orderBy: { path: 'asc' },
    });
    return rows.map(mapFolderRow);
  }

  async findIdsByPathPrefix(
    ownerKind: string,
    ownerId: string,
    pathPrefix: string,
    scope?: TransactionScope,
  ) {
    const rows = await this.getDelegate(scope).findMany({
      where: {
        ownerKind,
        ownerId,
        deletedAt: null,
        OR: [{ path: pathPrefix }, { path: { startsWith: `${pathPrefix}/` } }],
      },
      select: { id: true },
    });
    return rows.map((row) => row.id);
  }

  async create(data: ICreateFolderInput, scope?: TransactionScope) {
    const row = await this.getDelegate(scope).create({
      data: {
        ownerKind: data.ownerKind,
        ownerId: data.ownerId,
        createdBy: data.createdBy,
        name: data.name,
        parentId: data.parentId ?? null,
        path: data.path,
        depth: data.depth,
        isSystem: data.isSystem ?? false,
        systemType: data.systemType ?? null,
        allowedPurposes: data.allowedPurposes ?? [],
      },
    });
    return mapFolderRow(row);
  }

  async update(id: string, data: IUpdateFolderInput, scope?: TransactionScope) {
    const row = await this.getDelegate(scope).update({
      where: { id },
      data: {
        name: data.name,
        parentId: data.parentId,
        path: data.path,
        depth: data.depth,
        allowedPurposes: data.allowedPurposes,
      },
    });
    return mapFolderRow(row);
  }

  async updateMany(ids: string[], data: IUpdateFolderInput, scope?: TransactionScope) {
    const result = await this.getDelegate(scope).updateMany({
      where: { id: { in: ids } },
      data: {
        name: data.name,
        parentId: data.parentId,
        path: data.path,
        depth: data.depth,
        allowedPurposes: data.allowedPurposes,
      },
    });
    return result.count;
  }

  async softDeleteMany(ids: string[], scope?: TransactionScope) {
    const result = await this.getDelegate(scope).updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    return result.count;
  }
}
