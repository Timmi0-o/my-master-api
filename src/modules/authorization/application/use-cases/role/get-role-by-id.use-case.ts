import type {
  IGetRoleByIdApplicationInput,
  IGetRoleByIdApplicationOutput,
} from '../../dtos/role/get-role-by-id.output';
import { RoleNotFoundError } from 'src/modules/authorization/domain/entities/role';
import type { IRoleRepository } from 'src/modules/authorization/domain/repositories/role/i-role.repository';

export class GetRoleByIdUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(
    input: IGetRoleByIdApplicationInput,
  ): Promise<IGetRoleByIdApplicationOutput> {
    const entity = await this.roleRepository.findEntityById(input.roleId);

    if (!entity) {
      throw new RoleNotFoundError(input.roleId);
    }

    const item = await this.roleRepository.findOne(input.roleId, input.params);

    if (!item) {
      throw new RoleNotFoundError(input.roleId);
    }

    return item;
  }
}
