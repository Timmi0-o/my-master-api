import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import { mapMasterServicesToHttpResponse } from './map-master-service-http-response';

type MasterProfileWithRelations = IMasterProfilePublicEntity &
  Partial<IMasterProfileRelations>;

export function mapMasterProfileToHttpResponse(
  profile: MasterProfileWithRelations,
): MasterProfileWithRelations {
  if (profile.services == null) {
    return profile;
  }

  return {
    ...profile,
    services: mapMasterServicesToHttpResponse(profile.services),
  };
}

export function mapMasterProfilesToHttpResponse(
  profiles: MasterProfileWithRelations[],
): MasterProfileWithRelations[] {
  return profiles.map(mapMasterProfileToHttpResponse);
}
