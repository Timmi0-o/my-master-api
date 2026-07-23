import {
  ensureMasterSubscriptionExists,
  ensureMasterSubscriptionModifiable,
} from 'src/modules/masters/domain/entities/master-subscription';
import type { IMasterSubscriptionRepository } from 'src/modules/masters/domain/repositories/master-subscription/i-master-subscription.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IDeleteMasterSubscriptionApplicationInput } from '../../dtos/master-subscription/delete-master-subscription.input';
import type { IDeleteMasterSubscriptionApplicationOutput } from '../../dtos/master-subscription/delete-master-subscription.output';

export class DeleteMasterSubscriptionByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterSubscriptionRepository: IMasterSubscriptionRepository,
  ) {}

  async execute(
    input: IDeleteMasterSubscriptionApplicationInput,
  ): Promise<IDeleteMasterSubscriptionApplicationOutput> {
    const existing = await this.masterSubscriptionRepository.findEntityById(
      input.id,
    );
    ensureMasterSubscriptionExists(existing, input.id);
    ensureMasterSubscriptionModifiable(existing, input.actor);

    return this.transactionManager.runInTransaction((scope) =>
      this.masterSubscriptionRepository.softDelete(input.id, scope),
    );
  }
}
