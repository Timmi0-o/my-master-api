import { ensureMasterServiceExists } from 'src/modules/masters/domain/entities/master-service';
import {
  FavoriteMasterServiceAlreadyExistsError,
  type ICreateFavoriteMasterServiceInput,
} from 'src/modules/masters/domain/entities/favorite-master-service';
import type { IFavoriteMasterServiceRepository } from 'src/modules/masters/domain/repositories/favorite-master-service/i-favorite-master-service.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { ICreateFavoriteMasterServiceApplicationInput } from '../../dtos/favorite-master-service/create-favorite-master-service.input';
import type { ICreateFavoriteMasterServiceApplicationOutput } from '../../dtos/favorite-master-service/create-favorite-master-service.output';

export class CreateFavoriteMasterServiceUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly favoriteMasterServiceRepository: IFavoriteMasterServiceRepository,
    private readonly masterServiceRepository: IMasterServiceRepository,
  ) {}

  async execute(
    input: ICreateFavoriteMasterServiceApplicationInput,
  ): Promise<ICreateFavoriteMasterServiceApplicationOutput> {
    const service = await this.masterServiceRepository.findEntityById(
      input.masterServiceId,
    );
    ensureMasterServiceExists(service, input.masterServiceId);

    const existing =
      await this.favoriteMasterServiceRepository.findEntityByUserAndMasterServiceId(
        input.actor.userId,
        input.masterServiceId,
      );

    if (existing && existing.deletedAt == null) {
      throw new FavoriteMasterServiceAlreadyExistsError(
        input.actor.userId,
        input.masterServiceId,
      );
    }

    if (existing && existing.deletedAt != null) {
      return this.transactionManager.runInTransaction((scope) =>
        this.favoriteMasterServiceRepository.restore(existing.id, scope),
      );
    }

    const createInput: ICreateFavoriteMasterServiceInput = {
      userId: input.actor.userId,
      masterServiceId: input.masterServiceId,
    };

    return this.transactionManager.runInTransaction((scope) =>
      this.favoriteMasterServiceRepository.create(createInput, scope),
    );
  }
}
