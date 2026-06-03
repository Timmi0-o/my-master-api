import type { IUpdateMasterProfileInput } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface IUpdateMasterProfileApplicationInput {
  id: string;
  patch: IUpdateMasterProfileInput;
  actor: IMasterActorInput;
}
