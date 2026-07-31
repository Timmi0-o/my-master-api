import type { FindManyParams } from 'src/modules/shared/domain/query';
import { MASTER_SERVICE_OWNER_EMAIL_VERIFIED_WHERE } from 'src/modules/masters/domain/entities/master-profile/filters/master-owner-email-verified.where';
import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import { mergeWhereFilters } from 'src/modules/shared/application/presets/common/query-filter.helper';
import type { GetMasterServicesOutput } from '../../dtos/master-service/get-master-services.output';

export class GetMasterServicesUseCase {
  constructor(
    private readonly masterServiceRepository: IMasterServiceRepository,
  ) {}

  async execute(
    params: FindManyParams<IMasterServicePublicEntity, IMasterServiceRelations>,
  ): Promise<GetMasterServicesOutput> {
    const where = mergeWhereFilters(
      params.where,
      MASTER_SERVICE_OWNER_EMAIL_VERIFIED_WHERE,
    );
    const filteredParams = { ...params, where };

    const [items, total] = await Promise.all([
      this.masterServiceRepository.findMany(filteredParams),
      this.masterServiceRepository.count({ where }),
    ]);

    return { items, total };
  }
}
