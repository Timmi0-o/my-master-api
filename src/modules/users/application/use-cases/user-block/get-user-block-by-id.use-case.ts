import {
  UserBlockForbiddenError,
  UserBlockNotFoundError,
} from 'src/modules/users/domain/entities/user-block';
import type { IUserBlockRepository } from 'src/modules/users/domain/repositories/user-block/i-user-block.repository';
import type { IGetUserBlockByIdApplicationInput } from '../../dtos/user-block/get-user-block-by-id.input';
import type { IGetUserBlockByIdApplicationOutput } from '../../dtos/user-block/get-user-block-by-id.output';

export class GetUserBlockByIdUseCase {
  constructor(private readonly userBlockRepository: IUserBlockRepository) {}

  async execute(
    input: IGetUserBlockByIdApplicationInput,
  ): Promise<IGetUserBlockByIdApplicationOutput> {
    const entity = await this.userBlockRepository.findEntityById(input.id);
    if (!entity || (!input.isStaffUser && entity.deletedAt != null)) {
      throw new UserBlockNotFoundError(input.id);
    }

    if (!input.isStaffUser && entity.blockerUserId !== input.actorUserId) {
      throw new UserBlockForbiddenError(input.id);
    }

    const item = await this.userBlockRepository.findOne(input.id, input.params);
    if (!item) {
      throw new UserBlockNotFoundError(input.id);
    }

    return item;
  }
}
