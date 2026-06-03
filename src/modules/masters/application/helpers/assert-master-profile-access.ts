import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IMasterProfileEntity } from '../../domain/entities/master-profile';
import { MasterProfileForbiddenError } from '../../domain/errors/master-profile-forbidden.error';

export function assertMasterProfileAccess(
  profile: IMasterProfileEntity,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): void {
  if (isStaffUser) return;
  if (profile.userId !== sessionUser.id) {
    throw new MasterProfileForbiddenError(profile.id);
  }
}
