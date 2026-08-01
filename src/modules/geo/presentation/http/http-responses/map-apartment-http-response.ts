import type { IApartmentPublicEntity } from 'src/modules/geo/domain/entities/apartment/i-apartment.entity';

export type IApartmentHttpResponse = IApartmentPublicEntity;

export function mapApartmentToHttpResponse(
  entity: IApartmentPublicEntity,
): IApartmentHttpResponse {
  return entity;
}

export function mapApartmentsToHttpResponse(
  entities: IApartmentPublicEntity[],
): IApartmentHttpResponse[] {
  return entities.map(mapApartmentToHttpResponse);
}
