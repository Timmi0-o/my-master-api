import type { IDeleteUserProfileApplicationInput } from '../../dtos/user-profile/delete-user-profile.input';
import type { IDeleteUserProfileApplicationOutput } from '../../dtos/user-profile/delete-user-profile.output';
import {
  ensureUserProfileAccessible,
  ensureUserProfileExists,
} from 'src/modules/users/domain/entities/user-profile';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class DeleteUserProfileByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userProfileRepository: IUserProfileRepository,
  ) {}

  async execute(
    input: IDeleteUserProfileApplicationInput,
  ): Promise<IDeleteUserProfileApplicationOutput> {
    const existing = await this.userProfileRepository.findEntityById(input.id);
    ensureUserProfileExists(existing, input.id);
    ensureUserProfileAccessible(existing, input.actor);

    return this.transactionManager.runInTransaction((scope) =>
      this.userProfileRepository.softDelete(input.id, scope),
    );
  }
}
