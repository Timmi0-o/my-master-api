import type { IGetBuildingsApplicationInput } from 'src/modules/geo/application/dtos/building/get-buildings.input';
import type { IGetBuildingsApplicationOutput } from 'src/modules/geo/application/dtos/building/get-buildings.output';
import type { IBuildingRepository } from 'src/modules/geo/domain/repositories/building';

export class GetBuildingsUseCase {
  constructor(private readonly buildingRepository: IBuildingRepository) {}

  async execute(
    input: IGetBuildingsApplicationInput,
  ): Promise<IGetBuildingsApplicationOutput> {
    const items = await this.buildingRepository.findMany(input);
    return { items };
  }
}
