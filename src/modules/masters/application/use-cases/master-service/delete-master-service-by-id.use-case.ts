import type { IDeleteMasterServiceApplicationInput } from '../../dtos/master-service/delete-master-service.input';
import type { IDeleteMasterServiceApplicationOutput } from '../../dtos/master-service/delete-master-service.output';
import { ensureMasterServiceExists } from 'src/modules/masters/domain/entities/master-service';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class DeleteMasterServiceByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IDeleteMasterServiceApplicationInput,
  ): Promise<IDeleteMasterServiceApplicationOutput> {
    const existing = await this.masterServiceRepository.findEntityById(input.id);
    ensureMasterServiceExists(existing, input.id);

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureMasterProfileAccessible(profile, input.actor);

    return this.transactionManager.runInTransaction((scope) =>
      this.masterServiceRepository.softDelete(input.id, scope),
    );
  }
}
