import type { ITransactionManager } from '@shared/domain/transactions';
import { EAddressEntityType } from 'src/modules/geo/domain/entities/address';
import type { IAddressRepository } from 'src/modules/geo/domain/repositories/address';

export class DeleteMasterAddressUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(masterProfileId: string): Promise<void> {
    await this.transactionManager.runInTransaction((scope) =>
      this.addressRepository.deleteByEntity(
        EAddressEntityType.MASTER_PROFILE,
        masterProfileId,
        scope,
      ),
    );
  }
}
