import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { GetMasterServicesOutput } from '../../dtos/master-service/get-master-services.output';

export class GetMasterServicesUseCase {
  constructor(
    private readonly masterServiceRepository: IMasterServiceRepository,
  ) {}

  async execute(
    params: FindManyParams<IMasterServicePublicEntity, Record<never, never>>,
  ): Promise<GetMasterServicesOutput> {
    const [items, total] = await Promise.all([
      this.masterServiceRepository.findMany(params),
      this.masterServiceRepository.count({ where: params.where }),
    ]);

    return { items, total };
  }
}
