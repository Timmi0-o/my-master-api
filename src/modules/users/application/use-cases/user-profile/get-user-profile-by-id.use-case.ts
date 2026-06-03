import type { IGetUserProfileByIdApplicationInput } from 'src/modules/users/application/dtos/user-profile/get-user-profile-by-id.input';
import type { IUserProfilePublicEntity } from 'src/modules/users/domain/entities/user-profile';
import { UserProfileNotFoundError } from 'src/modules/users/domain/errors/user-profile-not-found.error';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';

export class GetUserProfileByIdUseCase {
  constructor(
    private readonly userProfileRepository: IUserProfileRepository,
  ) {}

  async execute(
    input: IGetUserProfileByIdApplicationInput,
  ): Promise<IUserProfilePublicEntity> {
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
