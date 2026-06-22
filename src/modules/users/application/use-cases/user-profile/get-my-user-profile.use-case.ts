import type { IGetMyUserProfileApplicationInput } from '../../dtos/user-profile/get-my-user-profile.input';
import type { IGetMyUserProfileApplicationOutput } from '../../dtos/user-profile/get-my-user-profile.output';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';

export class GetMyUserProfileUseCase {
  constructor(private readonly userProfileRepository: IUserProfileRepository) {}

  async execute(
    input: IGetMyUserProfileApplicationInput,
  ): Promise<IGetMyUserProfileApplicationOutput> {
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
