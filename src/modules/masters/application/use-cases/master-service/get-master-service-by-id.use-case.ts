import type { IGetMasterServiceByIdApplicationInput } from 'src/modules/masters/application/dtos/master-service/get-master-service-by-id.input';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import { MasterServiceNotFoundError } from 'src/modules/masters/domain/errors/master-service-not-found.error';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';

export class GetMasterServiceByIdUseCase {
  constructor(
    private readonly masterServiceRepository: IMasterServiceRepository,
  ) {}

  async execute(
    input: IGetMasterServiceByIdApplicationInput,
  ): Promise<IMasterServicePublicEntity> {
    const entity = await this.masterServiceRepository.findEntityById(input.id);
    if (!entity || (!input.actor.isStaffUser && entity.deletedAt != null)) {
      throw new MasterServiceNotFoundError(input.id);
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
