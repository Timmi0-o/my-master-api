import type { ICreateMasterServiceApplicationInput } from '../../dtos/master-service/create-master-service.input';
import type { ICreateMasterServiceApplicationOutput } from '../../dtos/master-service/create-master-service.output';
import type { ICreateMasterServiceInput } from 'src/modules/masters/domain/entities/master-service';
import { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class CreateMasterServiceUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: ICreateMasterServiceApplicationInput,
  ): Promise<ICreateMasterServiceApplicationOutput> {
    const profile = await this.masterProfileRepository.findEntityById(
      input.masterProfileId,
    );
    ensureMasterProfileExists(profile, input.masterProfileId);
    ensureMasterProfileAccessible(profile, input.actor);

    const createInput: ICreateMasterServiceInput = {
      masterProfileId: input.masterProfileId,
      name: input.name,
      description: input.description,
      price: input.price,
      durationMinutes: input.durationMinutes ?? 60,
      category: input.category ?? EMasterServiceCategory.SERVICES,
    };

    return this.transactionManager.runInTransaction((scope) =>
      this.masterServiceRepository.create(createInput, scope),
    );
  }
}
