import type {
  IGetRolesApplicationInput,
  IGetRolesApplicationOutput,
} from '../../dtos/role/get-roles.output';
import type { IRoleRepository } from 'src/modules/authorization/domain/repositories/role/i-role.repository';

export class GetRolesUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(
    input: IGetRolesApplicationInput,
  ): Promise<IGetRolesApplicationOutput> {
    const [items, total] = await Promise.all([
      this.roleRepository.findMany(input),
      this.roleRepository.count({ where: input.where }),
    ]);

    return { items, total };
  }
}
