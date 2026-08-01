import type { ILocalityPublicEntity } from '../../entities/locality/i-locality.entity';

export interface IFindLocalitiesParams {
  search?: string;
  regionId?: string;
  limit: number;
  offset: number;
}

export interface ILocalityRepository {
  findMany(params: IFindLocalitiesParams): Promise<ILocalityPublicEntity[]>;
  findBySlugOrId(slugOrId: string): Promise<ILocalityPublicEntity | null>;
}
