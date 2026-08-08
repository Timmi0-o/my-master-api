import type { IMasterActorInput } from 'src/modules/masters/application/dtos/common/i-master-actor.input';
import type { ISessionUser } from '@shared/domain/i-session-user';

export function requestParamsToMasterServiceReviewStatusActionUseCaseInput(
  id: string,
  user: ISessionUser,
  isStaffUser: boolean,
): { id: string; actor: IMasterActorInput } {
  return {
    id,
    actor: { userId: user.id, isStaffUser },
  };
}
