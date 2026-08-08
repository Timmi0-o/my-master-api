import type { ITransactionManager } from '@shared/domain/transactions';
import {
  EMasterServiceStatus,
  ensureMasterServiceExists,
} from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IApproveMasterServiceApplicationInput } from '../../dtos/master-service/approve-master-service.input';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';

export class ApproveMasterServiceByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceRepository: IMasterServiceRepository,
  ) {}

  async execute(
    input: IApproveMasterServiceApplicationInput,
  ): Promise<IMasterServicePublicEntity> {
    const existing = await this.masterServiceRepository.findEntityById(input.id);
    ensureMasterServiceExists(existing, input.id);

    return this.transactionManager.runInTransaction((scope) =>
      this.masterServiceRepository.update(
        input.id,
        { status: EMasterServiceStatus.ACTIVE },
        scope,
      ),
    );
  }
}
