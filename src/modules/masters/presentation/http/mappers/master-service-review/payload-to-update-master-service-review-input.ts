import type { IUpdateMasterServiceReviewApplicationInput } from 'src/modules/masters/application/dtos/master-service-review/update-master-service-review.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IUpdateMasterServiceReviewPayload } from '../../validation/schemas/update-master-service-review-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToUpdateMasterServiceReviewInput(
  id: string,
  payload: IUpdateMasterServiceReviewPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IUpdateMasterServiceReviewApplicationInput {
  return {
    id,
    patch: {
      ...(payload.rating !== undefined ? { rating: payload.rating } : {}),
      ...(payload.text !== undefined ? { text: payload.text } : {}),
    },
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
