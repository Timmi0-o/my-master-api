import type { ITransactionManager } from '@shared/domain/transactions';
import {
  EAddressEntityType,
  LocalityNotFoundError,
  type IAddressPublicEntity,
  type IUpsertAddressInput,
} from 'src/modules/geo/domain/entities/address';
import type { IAddressRepository } from 'src/modules/geo/domain/repositories/address';
import type { ILocalityRepository } from 'src/modules/geo/domain/repositories/locality';

export class UpsertUserProfileAddressUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly addressRepository: IAddressRepository,
    private readonly localityRepository: ILocalityRepository,
  ) {}

  async execute(
    input: Omit<IUpsertAddressInput, 'entityType'>,
  ): Promise<IAddressPublicEntity> {
    const locality = await this.localityRepository.findBySlugOrId(
      input.localityId,
    );
    if (!locality) {
      throw new LocalityNotFoundError(input.localityId);
    }

    const payload: IUpsertAddressInput = {
      ...input,
      entityType: EAddressEntityType.USER_PROFILE,
      countryId: input.countryId ?? locality.countryId,
      regionId: input.regionId ?? locality.regionId,
    };

    return this.transactionManager.runInTransaction((scope) =>
      this.addressRepository.replaceByEntity(payload, scope),
    );
  }
}
