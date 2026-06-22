import type { ICreateMasterProfileApplicationInput } from '../../dtos/master-profile/create-master-profile.input';
import type { ICreateMasterProfileApplicationOutput } from '../../dtos/master-profile/create-master-profile.output';
import type { ICreateMasterProfileInput } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class CreateMasterProfileUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: ICreateMasterProfileApplicationInput,
  ): Promise<ICreateMasterProfileApplicationOutput> {
    const userId =
      input.actor.isStaffUser && input.userId
        ? input.userId
        : input.actor.userId;

    const createInput: ICreateMasterProfileInput = {
      userId,
      displayName: input.displayName,
      description: input.description,
      rating: input.rating,
    };

    return this.transactionManager.runInTransaction((scope) =>
      this.masterProfileRepository.create(createInput, scope),
    );
  }
}
