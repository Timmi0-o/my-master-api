import type {
  IGetPermissionsApplicationInput,
  IGetPermissionsApplicationOutput,
} from '../../dtos/permission/get-permissions.output';
import type { IPermissionRepository } from 'src/modules/authorization/domain/repositories/permission/i-permission.repository';

export class GetPermissionsUseCase {
  constructor(private readonly permissionRepository: IPermissionRepository) {}

  async execute(
    input: IGetPermissionsApplicationInput,
  ): Promise<IGetPermissionsApplicationOutput> {
    const [items, total] = await Promise.all([
      this.permissionRepository.findMany(input),
      this.permissionRepository.count({ where: input.where }),
    ]);

    return { items, total };
  }
}
