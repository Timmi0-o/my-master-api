export interface IBuildingEntity {
  id: string;
  slug: string;
  name: string;
  houseNum: string | null;
  streetId: string | null;
  localityId: string | null;
  postalCode: string | null;
}

export type IBuildingPublicEntity = IBuildingEntity;
