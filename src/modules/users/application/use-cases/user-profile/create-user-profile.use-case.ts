import type { ICreateUserProfileApplicationInput } from '../../dtos/user-profile/create-user-profile.input';
import type { ICreateUserProfileApplicationOutput } from '../../dtos/user-profile/create-user-profile.output';
import type { ICreateUserProfileInput } from 'src/modules/users/domain/entities/user-profile';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class CreateUserProfileUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userProfileRepository: IUserProfileRepository,
  ) {}

  async execute(
    input: ICreateUserProfileApplicationInput,
  ): Promise<ICreateUserProfileApplicationOutput> {
    const userId =
      input.actor.isStaffUser && input.userId
        ? input.userId
        : input.actor.userId;

    const createInput: ICreateUserProfileInput = {
      userId,
      displayName: input.displayName,
      rating: input.rating,
    };

    return this.transactionManager.runInTransaction((scope) =>
      this.userProfileRepository.create(createInput, scope),
    );
  }
}
