import type { IUpdateUserProfileApplicationInput } from '../../dtos/user-profile/update-user-profile.input';
import type { IUpdateUserProfileApplicationOutput } from '../../dtos/user-profile/update-user-profile.output';
import type { IUpdateUserProfileInput } from 'src/modules/users/domain/entities/user-profile';
import {
  ensureUserProfileAccessible,
  ensureUserProfileExists,
} from 'src/modules/users/domain/entities/user-profile';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class UpdateUserProfileByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userProfileRepository: IUserProfileRepository,
  ) {}

  async execute(
    input: IUpdateUserProfileApplicationInput,
  ): Promise<IUpdateUserProfileApplicationOutput> {
    const existing = await this.userProfileRepository.findEntityById(input.id);
    ensureUserProfileExists(existing, input.id);
    ensureUserProfileAccessible(existing, input.actor);

    const data: IUpdateUserProfileInput = { ...input.patch };
    if (!input.actor.isStaffUser) {
      delete data.userId;
    }

    return this.transactionManager.runInTransaction((scope) =>
      this.userProfileRepository.update(input.id, data, scope),
    );
  }
}
