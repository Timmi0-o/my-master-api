import { mapFileToHttpResponse } from 'src/modules/files/presentation/http/response/map-file-response';
import type { IProfileAvatarView } from 'src/modules/masters/domain/entities/image';
import type {
  IUserProfilePublicEntity,
  IUserProfileRelations,
} from 'src/modules/users/domain/entities/user-profile';

type UserProfileWithRelations = IUserProfilePublicEntity &
  Partial<IUserProfileRelations>;

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

export function mapUserProfileToHttpResponse(
  profile: UserProfileWithRelations,
): UserProfileWithRelations {
  if (profile.avatar === undefined) {
    return profile;
  }

  return {
    ...profile,
    avatar: mapAvatarToHttpResponse(profile.avatar),
  };
}

export function mapUserProfilesToHttpResponse(
  profiles: UserProfileWithRelations[],
): UserProfileWithRelations[] {
  return profiles.map(mapUserProfileToHttpResponse);
}
