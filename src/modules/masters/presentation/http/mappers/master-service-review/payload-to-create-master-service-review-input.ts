import type { ICreateMasterServiceReviewApplicationInput } from 'src/modules/masters/application/dtos/master-service-review/create-master-service-review.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateMasterServiceReviewPayload } from '../../validation/schemas/create-master-service-review-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToCreateMasterServiceReviewInput(
  payload: ICreateMasterServiceReviewPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): ICreateMasterServiceReviewApplicationInput {
  return {
    appointmentId: payload.appointmentId,
    rating: payload.rating,
    text: payload.text,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
