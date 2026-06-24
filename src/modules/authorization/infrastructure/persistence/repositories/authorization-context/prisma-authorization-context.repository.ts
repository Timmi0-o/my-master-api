import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import type { IAuthorizationContext } from 'src/modules/authorization/domain/auth/authorization-context.types';
import { ERoleIdentifier } from 'src/modules/authorization/domain/entities/role';
import type { IAuthorizationContextRepository } from 'src/modules/authorization/domain/repositories/authorization-context/i-authorization-context.repository';
import { EUserStatus } from 'src/modules/users/domain/entities/user';

@Injectable()
export class PrismaAuthorizationContextRepository
  implements IAuthorizationContextRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async findByUserId(userId: string): Promise<IAuthorizationContext | null> {
    const row = await this.prismaService.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        status: true,
        roleId: true,
        role: {
          select: {
            roleIdentifier: true,
            rolePermissions: {
              select: {
                permission: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!row) {
      return null;
    }

    return {
      userId: row.id,
      roleId: row.roleId,
      roleIdentifier: row.role.roleIdentifier as ERoleIdentifier,
      permissions: row.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.name,
      ),
      status: row.status as EUserStatus,
    };
  }
}
