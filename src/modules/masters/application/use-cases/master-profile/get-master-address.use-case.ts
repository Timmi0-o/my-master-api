import {
  EAddressEntityType,
  type IAddressPublicEntity,
} from 'src/modules/geo/domain/entities/address';
import type { IAddressRepository } from 'src/modules/geo/domain/repositories/address';

export class GetMasterAddressUseCase {
  constructor(private readonly addressRepository: IAddressRepository) {}

  execute(masterProfileId: string): Promise<IAddressPublicEntity | null> {
    return this.addressRepository.findByEntity(
      EAddressEntityType.MASTER_PROFILE,
      masterProfileId,
    );
  }
}
