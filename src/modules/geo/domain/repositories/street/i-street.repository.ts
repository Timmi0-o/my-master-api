import type { IStreetPublicEntity } from '../../entities/street/i-street.entity';

export interface IFindStreetsParams {
  localityId: string;
  search?: string;
  limit: number;
  offset: number;
}

export interface IStreetRepository {
  findMany(params: IFindStreetsParams): Promise<IStreetPublicEntity[]>;
}
