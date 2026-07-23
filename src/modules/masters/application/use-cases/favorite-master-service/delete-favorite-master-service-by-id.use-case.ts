import {
  ensureFavoriteMasterServiceExists,
  ensureFavoriteMasterServiceModifiable,
} from 'src/modules/masters/domain/entities/favorite-master-service';
import type { IFavoriteMasterServiceRepository } from 'src/modules/masters/domain/repositories/favorite-master-service/i-favorite-master-service.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IDeleteFavoriteMasterServiceApplicationInput } from '../../dtos/favorite-master-service/delete-favorite-master-service.input';
import type { IDeleteFavoriteMasterServiceApplicationOutput } from '../../dtos/favorite-master-service/delete-favorite-master-service.output';

export class DeleteFavoriteMasterServiceByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly favoriteMasterServiceRepository: IFavoriteMasterServiceRepository,
  ) {}

  async execute(
    input: IDeleteFavoriteMasterServiceApplicationInput,
  ): Promise<IDeleteFavoriteMasterServiceApplicationOutput> {
    const existing = await this.favoriteMasterServiceRepository.findEntityById(
      input.id,
    );
    ensureFavoriteMasterServiceExists(existing, input.id);
    ensureFavoriteMasterServiceModifiable(existing, input.actor);

    return this.transactionManager.runInTransaction((scope) =>
      this.favoriteMasterServiceRepository.softDelete(input.id, scope),
    );
  }
}
