import { FavoriteMasterServiceNotFoundError } from 'src/modules/masters/domain/entities/favorite-master-service';
import type { IFavoriteMasterServiceRepository } from 'src/modules/masters/domain/repositories/favorite-master-service/i-favorite-master-service.repository';
import type { IGetFavoriteMasterServiceByIdApplicationInput } from '../../dtos/favorite-master-service/get-favorite-master-service-by-id.input';
import type { IGetFavoriteMasterServiceByIdApplicationOutput } from '../../dtos/favorite-master-service/get-favorite-master-service-by-id.output';

export class GetFavoriteMasterServiceByIdUseCase {
  constructor(
    private readonly favoriteMasterServiceRepository: IFavoriteMasterServiceRepository,
  ) {}

  async execute(
    input: IGetFavoriteMasterServiceByIdApplicationInput,
  ): Promise<IGetFavoriteMasterServiceByIdApplicationOutput> {
    const entity = await this.favoriteMasterServiceRepository.findEntityById(
      input.id,
    );
    if (!entity || (!input.isStaffUser && entity.deletedAt != null)) {
      throw new FavoriteMasterServiceNotFoundError(input.id);
    }

    const item = await this.favoriteMasterServiceRepository.findOne(
      input.id,
      input.params,
    );
    if (!item) {
      throw new FavoriteMasterServiceNotFoundError(input.id);
    }

    return item;
  }
}
