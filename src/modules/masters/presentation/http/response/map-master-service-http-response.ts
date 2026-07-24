import { mapFileToHttpResponse } from 'src/modules/files/presentation/http/response/map-file-response';
import type { IProfileAvatarView } from 'src/modules/masters/domain/entities/image';
import type {
  IMasterServiceImageView,
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';

type MasterServiceWithRelations = IMasterServicePublicEntity &
  Partial<IMasterServiceRelations>;

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

export function mapMasterServiceToHttpResponse(
  service: MasterServiceWithRelations,
): MasterServiceWithRelations {
  let next = service;

  if (next.masterProfile != null && next.masterProfile.avatar !== undefined) {
    next = {
      ...next,
      masterProfile: {
        ...next.masterProfile,
        avatar: mapAvatarToHttpResponse(next.masterProfile.avatar),
      },
    };
  }

  if (next.images == null) {
    return next;
  }

  return {
    ...next,
    images: next.images.map(
      (image): IMasterServiceImageView => ({
        ...image,
        ...(image.file != null
          ? {
              file: mapFileToHttpResponse(image.file) as unknown as NonNullable<
                IMasterServiceImageView['file']
              >,
            }
          : {}),
      }),
    ),
  };
}

export function mapMasterServicesToHttpResponse(
  services: MasterServiceWithRelations[],
): MasterServiceWithRelations[] {
  return services.map(mapMasterServiceToHttpResponse);
}
