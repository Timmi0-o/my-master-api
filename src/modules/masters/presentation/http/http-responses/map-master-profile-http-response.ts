import { mapFileToHttpResponse } from 'src/modules/files/presentation/http/http-responses/map-file-response';
import type { IProfileAvatarView } from 'src/modules/masters/domain/entities/image';
import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IUserPersonalNotePublicEntity } from 'src/modules/users/domain/entities/user-personal-note';
import { mapMasterServicesToHttpResponse } from './map-master-service-http-response';

type MasterProfileWithRelations = IMasterProfilePublicEntity &
  Partial<IMasterProfileRelations> & {
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

export function mapMasterProfileToHttpResponse(
  profile: MasterProfileWithRelations,
): MasterProfileWithRelations {
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

  if (next.services == null) {
    return next;
  }

  return {
    ...next,
    services: mapMasterServicesToHttpResponse(next.services),
  };
}

export function mapMasterProfilesToHttpResponse(
  profiles: MasterProfileWithRelations[],
): MasterProfileWithRelations[] {
  return profiles.map(mapMasterProfileToHttpResponse);
}
