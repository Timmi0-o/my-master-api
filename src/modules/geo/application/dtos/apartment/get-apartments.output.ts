import type { IApartmentPublicEntity } from 'src/modules/geo/domain/entities/apartment/i-apartment.entity';

export interface IGetApartmentsApplicationOutput {
  items: IApartmentPublicEntity[];
}
