import type { ITransactionManager } from '@shared/domain/transactions';
import { UserNotFoundError } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { IUpdateOwnLanguageApplicationInput } from '../../dtos/user/update-own-language.input';
import type { IUpdateOwnLanguageApplicationOutput } from '../../dtos/user/update-own-language.output';

export class UpdateOwnLanguageUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    input: IUpdateOwnLanguageApplicationInput,
  ): Promise<IUpdateOwnLanguageApplicationOutput> {
    const user = await this.userRepository.findEntityById(input.userId);
    if (!user || user.deletedAt) {
      throw new UserNotFoundError(input.userId);
    }

    return this.transactionManager.runInTransaction((scope) =>
      this.userRepository.update(
        input.userId,
        { language: input.language },
        scope,
      ),
    );
  }
}
