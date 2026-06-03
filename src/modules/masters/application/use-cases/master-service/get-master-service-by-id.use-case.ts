import type { FindOneParams } from 'src/modules/shared/domain/query';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import { MasterServiceNotFoundError } from 'src/modules/masters/domain/errors/master-service-not-found.error';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';

export class GetMasterServiceByIdUseCase {
  constructor(
    private readonly masterServiceRepository: IMasterServiceRepository,
  ) {}

  async execute(
    id: string,
    isStaffUser: boolean,
    params?: FindOneParams<IMasterServicePublicEntity, Record<never, never>>,
  ): Promise<IMasterServicePublicEntity> {
    const entity = await this.masterServiceRepository.findEntityById(id);
    if (!entity || (!isStaffUser && entity.deletedAt != null)) {
      throw new MasterServiceNotFoundError(id);
    }

    const item = await this.masterServiceRepository.findOne(id, params);
    if (!item) {
      throw new MasterServiceNotFoundError(id);
    }
    return item;
  }
}
