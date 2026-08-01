import type { ILocalityPublicEntity } from 'src/modules/geo/domain/entities/locality/i-locality.entity';

export interface IGetLocalitiesApplicationOutput {
  items: ILocalityPublicEntity[];
}
