import type { IDeleteMasterProfileApplicationInput } from '../../dtos/master-profile/delete-master-profile.input';
import type { IDeleteMasterProfileApplicationOutput } from '../../dtos/master-profile/delete-master-profile.output';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class DeleteMasterProfileByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IDeleteMasterProfileApplicationInput,
  ): Promise<IDeleteMasterProfileApplicationOutput> {
    const existing = await this.masterProfileRepository.findEntityById(
      input.id,
    );
    ensureMasterProfileExists(existing, input.id);
    ensureMasterProfileAccessible(existing, input.actor);

    return this.transactionManager.runInTransaction((scope) =>
      this.masterProfileRepository.softDelete(input.id, scope),
    );
  }
}
