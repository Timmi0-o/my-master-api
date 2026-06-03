import type { IGetMyUserProfileApplicationInput } from 'src/modules/users/application/dtos/user-profile/get-my-user-profile.input';
import type { IUserProfilePublicEntity } from 'src/modules/users/domain/entities/user-profile';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';

export class GetMyUserProfileUseCase {
  constructor(private readonly userProfileRepository: IUserProfileRepository) {}

  async execute(
    input: IGetMyUserProfileApplicationInput,
  ): Promise<IUserProfilePublicEntity | null> {
    const entity = await this.userProfileRepository.findEntityByUserId(
      input.actor.userId,
    );

    if (!entity || (!input.actor.isStaffUser && entity.deletedAt != null)) {
      return null;
    }

    const item = await this.userProfileRepository.findOne(
      entity.id,
      input.params,
    );

    return item ?? null;
  }
}
