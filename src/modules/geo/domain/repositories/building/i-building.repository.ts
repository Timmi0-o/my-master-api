import type { IBuildingPublicEntity } from '../../entities/building/i-building.entity';

export interface IFindBuildingsParams {
  streetId: string;
  search?: string;
  limit: number;
  offset: number;
}

export interface IBuildingRepository {
  findMany(params: IFindBuildingsParams): Promise<IBuildingPublicEntity[]>;
}
