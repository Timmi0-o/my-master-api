import type { ITransactionManager } from '@shared/domain/transactions';
import {
  ensureUserBlockExists,
  ensureUserBlockModifiable,
} from 'src/modules/users/domain/entities/user-block';
import type { IUserBlockRepository } from 'src/modules/users/domain/repositories/user-block/i-user-block.repository';
import type { IDeleteUserBlockApplicationInput } from '../../dtos/user-block/delete-user-block.input';
import type { IDeleteUserBlockApplicationOutput } from '../../dtos/user-block/delete-user-block.output';

export class DeleteUserBlockByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userBlockRepository: IUserBlockRepository,
  ) {}

  async execute(
    input: IDeleteUserBlockApplicationInput,
  ): Promise<IDeleteUserBlockApplicationOutput> {
    const existing = await this.userBlockRepository.findEntityById(input.id);
    ensureUserBlockExists(existing, input.id);
    ensureUserBlockModifiable(existing, input.actor);

    return this.transactionManager.runInTransaction((scope) =>
      this.userBlockRepository.softDelete(input.id, scope),
    );
  }
}
