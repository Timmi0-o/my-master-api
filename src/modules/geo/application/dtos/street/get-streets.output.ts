import type { IStreetPublicEntity } from 'src/modules/geo/domain/entities/street/i-street.entity';

export interface IGetStreetsApplicationOutput {
  items: IStreetPublicEntity[];
}
