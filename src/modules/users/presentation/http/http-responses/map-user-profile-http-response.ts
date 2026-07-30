import { mapFileToHttpResponse } from 'src/modules/files/presentation/http/http-responses/map-file-response';
import type { IProfileAvatarView } from 'src/modules/masters/domain/entities/image';
import type { IUserPersonalNotePublicEntity } from 'src/modules/users/domain/entities/user-personal-note';
import type {
  IUserProfilePublicEntity,
  IUserProfileRelations,
} from 'src/modules/users/domain/entities/user-profile';

type UserProfileWithRelations = IUserProfilePublicEntity &
  Partial<IUserProfileRelations> & {
    personalNote?: IUserPersonalNotePublicEntity | null;
  };

function mapProfileMediaToHttpResponse(
  media: IProfileAvatarView | null | undefined,
): IProfileAvatarView | null | undefined {
  if (media == null) {
    return media;
  }

  return {
    ...media,
    ...(media.file != null
      ? {
          file: mapFileToHttpResponse(media.file) as unknown as NonNullable<
            IProfileAvatarView['file']
          >,
        }
      : {}),
  };
}

export function mapUserProfileToHttpResponse(
  profile: UserProfileWithRelations,
): UserProfileWithRelations {
  let next = profile;

  if (next.avatar !== undefined) {
    next = {
      ...next,
      avatar: mapProfileMediaToHttpResponse(next.avatar),
    };
  }

  if (next.banner !== undefined) {
    next = {
      ...next,
      banner: mapProfileMediaToHttpResponse(next.banner),
    };
  }

  return next;
}

export function mapUserProfilesToHttpResponse(
  profiles: UserProfileWithRelations[],
): UserProfileWithRelations[] {
  return profiles.map(mapUserProfileToHttpResponse);
}
