import type { IBuildingPublicEntity } from 'src/modules/geo/domain/entities/building/i-building.entity';

export type IBuildingHttpResponse = IBuildingPublicEntity;

export function mapBuildingToHttpResponse(
  entity: IBuildingPublicEntity,
): IBuildingHttpResponse {
  return entity;
}

export function mapBuildingsToHttpResponse(
  entities: IBuildingPublicEntity[],
): IBuildingHttpResponse[] {
  return entities.map(mapBuildingToHttpResponse);
}
