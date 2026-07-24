import { mapFileToHttpResponse } from 'src/modules/files/presentation/http/response/map-file-response';
import type { IProfileAvatarView } from 'src/modules/masters/domain/entities/image';
import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import { mapMasterServicesToHttpResponse } from './map-master-service-http-response';

type MasterProfileWithRelations = IMasterProfilePublicEntity &
  Partial<IMasterProfileRelations>;

function mapAvatarToHttpResponse(
  avatar: IProfileAvatarView | null | undefined,
): IProfileAvatarView | null | undefined {
  if (avatar == null) {
    return avatar;
  }

  return {
    ...avatar,
    ...(avatar.file != null
      ? {
          file: mapFileToHttpResponse(avatar.file) as unknown as NonNullable<
            IProfileAvatarView['file']
          >,
        }
      : {}),
  };
}

export function mapMasterProfileToHttpResponse(
  profile: MasterProfileWithRelations,
): MasterProfileWithRelations {
  const withAvatar =
    profile.avatar !== undefined
      ? {
          ...profile,
          avatar: mapAvatarToHttpResponse(profile.avatar),
        }
      : profile;

  if (withAvatar.services == null) {
    return withAvatar;
  }

  return {
    ...withAvatar,
    services: mapMasterServicesToHttpResponse(withAvatar.services),
  };
}

export function mapMasterProfilesToHttpResponse(
  profiles: MasterProfileWithRelations[],
): MasterProfileWithRelations[] {
  return profiles.map(mapMasterProfileToHttpResponse);
}
