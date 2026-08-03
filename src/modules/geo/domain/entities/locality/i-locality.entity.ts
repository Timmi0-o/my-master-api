export interface ILocalityEntity {
  id: string;
  slug: string;
  name: string;
  type: string;
  main: boolean;
  countryId: string;
  regionId: string;
  descriptions: string | null;
  metaTitle: string | null;
  metaDescriptions: string | null;
  metaKeywords: string | null;
}

export type ILocalityPublicEntity = ILocalityEntity;
