import type { IApartmentPublicEntity } from '../../entities/apartment/i-apartment.entity';

export interface IFindApartmentsParams {
  buildingId: string;
  search?: string;
  limit: number;
  offset: number;
}

export interface IApartmentRepository {
  findMany(params: IFindApartmentsParams): Promise<IApartmentPublicEntity[]>;
}
