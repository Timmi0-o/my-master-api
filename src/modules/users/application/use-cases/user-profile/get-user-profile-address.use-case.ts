import {
  EAddressEntityType,
  type IAddressPublicEntity,
} from 'src/modules/geo/domain/entities/address';
import type { IAddressRepository } from 'src/modules/geo/domain/repositories/address';

export class GetUserProfileAddressUseCase {
  constructor(private readonly addressRepository: IAddressRepository) {}

  execute(userProfileId: string): Promise<IAddressPublicEntity | null> {
    return this.addressRepository.findByEntity(
      EAddressEntityType.USER_PROFILE,
      userProfileId,
    );
  }
}
