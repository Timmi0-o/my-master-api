import type { ICreateUserProfileApplicationInput } from 'src/modules/users/application/dtos/user-profile/create-user-profile.input';
import type {
  ICreateUserProfileInput,
  IUserProfileEntity,
} from 'src/modules/users/domain/entities/user-profile';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';

export class CreateUserProfileUseCase {
  constructor(private readonly userProfileRepository: IUserProfileRepository) {}

  async execute(
    input: ICreateUserProfileApplicationInput,
  ): Promise<IUserProfileEntity> {
    const userId =
      input.actor.isStaffUser && input.userId
        ? input.userId
        : input.actor.userId;

    const createInput: ICreateUserProfileInput = {
      userId,
      displayName: input.displayName,
      rating: input.rating,
    };

    return this.userProfileRepository.create(createInput);
  }
}
