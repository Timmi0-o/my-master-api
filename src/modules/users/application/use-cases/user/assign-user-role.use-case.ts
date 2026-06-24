import type { IAssignUserRoleApplicationInput } from '../../dtos/user/assign-user-role.input';
import type { IAssignUserRoleApplicationOutput } from '../../dtos/user/assign-user-role.output';
import { RoleNotFoundError } from 'src/modules/authorization/domain/entities/role';
import type { IRoleRepository } from 'src/modules/authorization/domain/repositories/role/i-role.repository';
import { UserNotFoundError } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class AssignUserRoleUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(
    input: IAssignUserRoleApplicationInput,
  ): Promise<IAssignUserRoleApplicationOutput> {
    const [user, role] = await Promise.all([
      this.userRepository.findEntityById(input.userId),
      this.roleRepository.findEntityById(input.roleId),
    ]);

    if (!user || user.deletedAt) {
      throw new UserNotFoundError(input.userId);
    }

    if (!role || !role.isActive) {
      throw new RoleNotFoundError(input.roleId);
    }

    return this.transactionManager.runInTransaction((scope) =>
      this.userRepository.update(
        input.userId,
        { roleId: input.roleId },
        scope,
      ),
    );
  }
}
