import type { IMasterActorInput } from '../common/i-master-actor.input';
import type { IUpdateMasterServiceReviewInput } from 'src/modules/masters/domain/entities/master-service-review';

export interface IUpdateMasterServiceReviewApplicationInput {
  id: string;
  patch: IUpdateMasterServiceReviewInput;
  actor: IMasterActorInput;
}
