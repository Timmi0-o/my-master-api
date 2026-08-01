import type { IGetStreetsApplicationInput } from 'src/modules/geo/application/dtos/street/get-streets.input';
import type { IGetStreetsApplicationOutput } from 'src/modules/geo/application/dtos/street/get-streets.output';
import type { IStreetRepository } from 'src/modules/geo/domain/repositories/street';

export class GetStreetsUseCase {
  constructor(private readonly streetRepository: IStreetRepository) {}

  async execute(
    input: IGetStreetsApplicationInput,
  ): Promise<IGetStreetsApplicationOutput> {
    const items = await this.streetRepository.findMany(input);
    return { items };
  }
}
