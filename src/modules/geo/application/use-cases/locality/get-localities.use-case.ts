import type { IGetLocalitiesApplicationInput } from 'src/modules/geo/application/dtos/locality/get-localities.input';
import type { IGetLocalitiesApplicationOutput } from 'src/modules/geo/application/dtos/locality/get-localities.output';
import type { ILocalityRepository } from 'src/modules/geo/domain/repositories/locality';

export class GetLocalitiesUseCase {
  constructor(private readonly localityRepository: ILocalityRepository) {}

  async execute(
    input: IGetLocalitiesApplicationInput,
  ): Promise<IGetLocalitiesApplicationOutput> {
    const items = await this.localityRepository.findMany(input);
    return { items };
  }
}
