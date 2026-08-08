import type { ITransactionManager } from '@shared/domain/transactions';
import {
  EMasterServiceStatus,
  ensureMasterServiceExists,
} from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IBlockMasterServiceApplicationInput } from '../../dtos/master-service/block-master-service.input';

export class BlockMasterServiceByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceRepository: IMasterServiceRepository,
  ) {}

  async execute(
    input: IBlockMasterServiceApplicationInput,
  ): Promise<IMasterServicePublicEntity> {
    const existing = await this.masterServiceRepository.findEntityById(input.id);
    ensureMasterServiceExists(existing, input.id);

    return this.transactionManager.runInTransaction((scope) =>
      this.masterServiceRepository.update(
        input.id,
        { status: EMasterServiceStatus.BLOCKED },
        scope,
      ),
    );
  }
}
