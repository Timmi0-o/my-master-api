import type { IUpdateMasterProfileApplicationInput } from '../../dtos/master-profile/update-master-profile.input';
import type { IUpdateMasterProfileApplicationOutput } from '../../dtos/master-profile/update-master-profile.output';
import type { IUpdateMasterProfileInput } from 'src/modules/masters/domain/entities/master-profile';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class UpdateMasterProfileByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IUpdateMasterProfileApplicationInput,
  ): Promise<IUpdateMasterProfileApplicationOutput> {
    const existing = await this.masterProfileRepository.findEntityById(
      input.id,
    );
    ensureMasterProfileExists(existing, input.id);
    ensureMasterProfileAccessible(existing, input.actor);

    const data: IUpdateMasterProfileInput = { ...input.patch };
    if (!input.actor.isStaffUser) {
      delete data.userId;
    }

    return this.transactionManager.runInTransaction((scope) =>
      this.masterProfileRepository.update(input.id, data, scope),
    );
  }
}
