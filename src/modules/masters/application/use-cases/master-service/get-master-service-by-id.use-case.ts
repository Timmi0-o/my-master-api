import {
  isMasterServicePubliclyVisible,
  MasterServiceNotFoundError,
} from 'src/modules/masters/domain/entities/master-service';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IGetMasterServiceByIdApplicationInput } from '../../dtos/master-service/get-master-service-by-id.input';
import type { IGetMasterServiceByIdApplicationOutput } from '../../dtos/master-service/get-master-service-by-id.output';

export class GetMasterServiceByIdUseCase {
  constructor(
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IGetMasterServiceByIdApplicationInput,
  ): Promise<IGetMasterServiceByIdApplicationOutput> {
    const entity = await this.masterServiceRepository.findEntityById(input.id);
    if (!entity || (!input.actor.isStaffUser && entity.deletedAt != null)) {
      throw new MasterServiceNotFoundError(input.id);
    }

    if (!input.actor.isStaffUser && !isMasterServicePubliclyVisible(entity)) {
      const profile = await this.masterProfileRepository.findEntityById(
        entity.masterProfileId,
      );
      if (!profile || profile.userId !== input.actor.userId) {
        throw new MasterServiceNotFoundError(input.id);
      }
    }

    const item = await this.masterServiceRepository.findOne(
      input.id,
      input.params,
    );

    if (!item) {
      throw new MasterServiceNotFoundError(input.id);
    }

    return item;
  }
}
