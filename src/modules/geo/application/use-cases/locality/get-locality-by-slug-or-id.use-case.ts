import type { IGetLocalityBySlugOrIdApplicationInput } from 'src/modules/geo/application/dtos/locality/get-locality-by-slug-or-id.input';
import type { IGetLocalityBySlugOrIdApplicationOutput } from 'src/modules/geo/application/dtos/locality/get-locality-by-slug-or-id.output';
import { LocalityNotFoundError } from 'src/modules/geo/domain/entities/address';
import type { ILocalityRepository } from 'src/modules/geo/domain/repositories/locality';

export class GetLocalityBySlugOrIdUseCase {
  constructor(private readonly localityRepository: ILocalityRepository) {}

  async execute(
    input: IGetLocalityBySlugOrIdApplicationInput,
  ): Promise<IGetLocalityBySlugOrIdApplicationOutput> {
    const locality = await this.localityRepository.findBySlugOrId(
      input.slugOrId,
    );
    if (!locality) {
      throw new LocalityNotFoundError(input.slugOrId);
    }
    return locality;
  }
}
