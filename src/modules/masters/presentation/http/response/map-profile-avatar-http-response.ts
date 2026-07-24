import { mapFileToHttpResponse } from 'src/modules/files/presentation/http/response/map-file-response';
import type { IProfileAvatarView } from 'src/modules/masters/domain/entities/image';

export function mapProfileAvatarToHttpResponse(
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
