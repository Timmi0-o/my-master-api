import type { IBuildingPublicEntity } from 'src/modules/geo/domain/entities/building/i-building.entity';

export interface IGetBuildingsApplicationOutput {
  items: IBuildingPublicEntity[];
}
