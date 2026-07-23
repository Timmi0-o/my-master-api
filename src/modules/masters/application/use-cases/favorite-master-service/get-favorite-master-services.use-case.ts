import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations,
} from 'src/modules/masters/domain/entities/favorite-master-service';
import type { IFavoriteMasterServiceRepository } from 'src/modules/masters/domain/repositories/favorite-master-service/i-favorite-master-service.repository';
import type { GetFavoriteMasterServicesOutput } from '../../dtos/favorite-master-service/get-favorite-master-services.output';

export class GetFavoriteMasterServicesUseCase {
  constructor(
    private readonly favoriteMasterServiceRepository: IFavoriteMasterServiceRepository,
  ) {}

  async execute(
    params: FindManyParams<
      IFavoriteMasterServicePublicEntity,
      IFavoriteMasterServiceRelations
    >,
  ): Promise<GetFavoriteMasterServicesOutput> {
    const [items, total] = await Promise.all([
      this.favoriteMasterServiceRepository.findMany(params),
      this.favoriteMasterServiceRepository.count({ where: params.where }),
    ]);

    return { items, total };
  }
}
