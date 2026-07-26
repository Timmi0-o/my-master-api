import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  IUserBlockPublicEntity,
  IUserBlockRelations,
} from 'src/modules/users/domain/entities/user-block';
import type { IUserBlockRepository } from 'src/modules/users/domain/repositories/user-block/i-user-block.repository';
import type { GetUserBlocksOutput } from '../../dtos/user-block/get-user-blocks.output';

export class GetUserBlocksUseCase {
  constructor(private readonly userBlockRepository: IUserBlockRepository) {}

  async execute(
    params: FindManyParams<IUserBlockPublicEntity, IUserBlockRelations>,
  ): Promise<GetUserBlocksOutput> {
    const [items, total] = await Promise.all([
      this.userBlockRepository.findMany(params),
      this.userBlockRepository.count({ where: params.where }),
    ]);

    return { items, total };
  }
}
