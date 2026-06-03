import type { IDeleteUserProfileApplicationInput } from 'src/modules/users/application/dtos/user-profile/delete-user-profile.input';
import { UserProfileNotFoundError } from 'src/modules/users/domain/errors/user-profile-not-found.error';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';
import { assertUserProfileAccess } from '../../helpers/assert-user-profile-access';

export class DeleteUserProfileByIdUseCase {
  constructor(
    private readonly userProfileRepository: IUserProfileRepository,
  ) {}

  async execute(input: IDeleteUserProfileApplicationInput): Promise<boolean> {
    const existing = await this.userProfileRepository.findEntityById(input.id);
    if (!existing) {
      throw new UserProfileNotFoundError(input.id);
    }

    assertUserProfileAccess(existing, input.actor);

    return this.userProfileRepository.softDeleteById(input.id);
  }
}
