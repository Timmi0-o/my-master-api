import type { IUpdateUserProfileApplicationInput } from 'src/modules/users/application/dtos/user-profile/update-user-profile.input';
import type {
  IUserProfileEntity,
  IUpdateUserProfileInput,
} from 'src/modules/users/domain/entities/user-profile';
import { UserProfileNotFoundError } from 'src/modules/users/domain/errors/user-profile-not-found.error';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';
import { assertUserProfileAccess } from '../../helpers/assert-user-profile-access';

export class UpdateUserProfileByIdUseCase {
  constructor(
    private readonly userProfileRepository: IUserProfileRepository,
  ) {}

  async execute(
    input: IUpdateUserProfileApplicationInput,
  ): Promise<IUserProfileEntity> {
    const existing = await this.userProfileRepository.findEntityById(input.id);
    if (!existing) {
      throw new UserProfileNotFoundError(input.id);
    }

    assertUserProfileAccess(existing, input.actor);

    const data: IUpdateUserProfileInput = { ...input.patch };
    if (!input.actor.isStaffUser) {
      delete data.userId;
    }

    return this.userProfileRepository.update(input.id, data);
  }
}
