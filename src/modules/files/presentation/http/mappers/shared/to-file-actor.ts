import type { IFileActorInput } from 'src/modules/files/application/dtos/common/i-file-actor.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';

export function toFileActor(
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IFileActorInput {
  return {
    userId: sessionUser.id,
    isStaffUser: metadata.isStaffUser,
    userRole: sessionUser.role,
  };
}
