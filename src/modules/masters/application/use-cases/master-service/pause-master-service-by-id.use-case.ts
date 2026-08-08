import type { ITransactionManager } from '@shared/domain/transactions';
import {
  EMasterServiceStatus,
  ensureMasterServiceExists,
  ensureMasterServicePausable,
} from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IPauseMasterServiceApplicationInput } from '../../dtos/master-service/pause-master-service.input';

export class PauseMasterServiceByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IPauseMasterServiceApplicationInput,
  ): Promise<IMasterServicePublicEntity> {
    const existing = await this.masterServiceRepository.findEntityById(input.id);
    ensureMasterServiceExists(existing, input.id);
    ensureMasterServicePausable(existing);

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureMasterProfileAccessible(profile, input.actor);

    return this.transactionManager.runInTransaction((scope) =>
      this.masterServiceRepository.update(
        input.id,
        { status: EMasterServiceStatus.PAUSED },
        scope,
      ),
    );
  }
}
