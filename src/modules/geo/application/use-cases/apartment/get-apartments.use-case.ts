import type { IGetApartmentsApplicationInput } from 'src/modules/geo/application/dtos/apartment/get-apartments.input';
import type { IGetApartmentsApplicationOutput } from 'src/modules/geo/application/dtos/apartment/get-apartments.output';
import type { IApartmentRepository } from 'src/modules/geo/domain/repositories/apartment';

export class GetApartmentsUseCase {
  constructor(private readonly apartmentRepository: IApartmentRepository) {}

  async execute(
    input: IGetApartmentsApplicationInput,
  ): Promise<IGetApartmentsApplicationOutput> {
    const items = await this.apartmentRepository.findMany(input);
    return { items };
  }
}
