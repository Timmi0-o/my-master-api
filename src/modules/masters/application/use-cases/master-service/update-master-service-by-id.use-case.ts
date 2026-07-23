import type { IUpdateMasterServiceApplicationInput } from '../../dtos/master-service/update-master-service.input';
import type { IUpdateMasterServiceApplicationOutput } from '../../dtos/master-service/update-master-service.output';
import {
  ensureMasterServiceExists,
  ensureMasterServiceTagsValid,
} from 'src/modules/masters/domain/entities/master-service';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class UpdateMasterServiceByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IUpdateMasterServiceApplicationInput,
  ): Promise<IUpdateMasterServiceApplicationOutput> {
    const existing = await this.masterServiceRepository.findEntityById(input.id);
    ensureMasterServiceExists(existing, input.id);

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureMasterProfileAccessible(profile, input.actor);

    const patch =
      input.patch.tags != null
        ? {
            ...input.patch,
            tags: ensureMasterServiceTagsValid(input.patch.tags),
          }
        : input.patch;

    return this.transactionManager.runInTransaction((scope) =>
      this.masterServiceRepository.update(input.id, patch, scope),
    );
  }
}
