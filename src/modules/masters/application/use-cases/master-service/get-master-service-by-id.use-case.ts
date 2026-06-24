import { MasterServiceNotFoundError } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IGetMasterServiceByIdApplicationInput } from '../../dtos/master-service/get-master-service-by-id.input';
import type { IGetMasterServiceByIdApplicationOutput } from '../../dtos/master-service/get-master-service-by-id.output';

export class GetMasterServiceByIdUseCase {
  constructor(
    private readonly masterServiceRepository: IMasterServiceRepository,
  ) {}

  async execute(
    input: IGetMasterServiceByIdApplicationInput,
  ): Promise<IGetMasterServiceByIdApplicationOutput> {
    const entity = await this.masterServiceRepository.findEntityById(input.id);
    if (!entity || (!input.actor.isStaffUser && entity.deletedAt != null)) {
      throw new MasterServiceNotFoundError(input.id);
    }

    const item = await this.masterServiceRepository.findOne(
      input.id,
      input.params,
    );

    console.log('item', item?.images?.[0]?.file);

    if (!item) {
      throw new MasterServiceNotFoundError(input.id);
    }

    return item;
  }
}
