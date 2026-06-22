import type { IGetUserProfileByIdApplicationInput } from '../../dtos/user-profile/get-user-profile-by-id.input';
import type { IGetUserProfileByIdApplicationOutput } from '../../dtos/user-profile/get-user-profile-by-id.output';
import { UserProfileNotFoundError } from 'src/modules/users/domain/entities/user-profile';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';

export class GetUserProfileByIdUseCase {
  constructor(
    private readonly userProfileRepository: IUserProfileRepository,
  ) {}

  async execute(
    input: IGetUserProfileByIdApplicationInput,
  ): Promise<IGetUserProfileByIdApplicationOutput> {
    const entity = await this.userProfileRepository.findEntityById(input.id);

    if (!entity || (!input.actor.isStaffUser && entity.deletedAt != null)) {
      throw new UserProfileNotFoundError(input.id);
    }

    const item = await this.userProfileRepository.findOne(
      input.id,
      input.params,
    );

    if (!item) {
      throw new UserProfileNotFoundError(input.id);
    }

    return item;
  }
}
