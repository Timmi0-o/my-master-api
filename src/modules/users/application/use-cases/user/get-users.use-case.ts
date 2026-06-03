import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { GetUsersOutput } from '../../dtos/user/get-users.output';

export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    params: FindManyParams<IUserPublicEntity, Record<never, never>>,
  ): Promise<GetUsersOutput> {
    const [items, total] = await Promise.all([
      this.userRepository.findMany(params),
      this.userRepository.count({ where: params.where }),
    ]);

    return { items, total };
  }
}
