import type { IUpsertMasterServiceReviewReactionApplicationInput } from 'src/modules/masters/application/dtos/master-service-review-reaction/upsert-master-service-review-reaction.input';
import {
  EMasterServiceReviewReactionType,
} from 'src/modules/masters/domain/entities/master-service-review-reaction';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateMasterServiceReviewReactionPayload } from '../../validation/schemas/create-master-service-review-reaction-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToUpsertMasterServiceReviewReactionInput(
  payload: ICreateMasterServiceReviewReactionPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IUpsertMasterServiceReviewReactionApplicationInput {
  return {
    masterServiceReviewId: payload.masterServiceReviewId,
    type: payload.type as EMasterServiceReviewReactionType,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
