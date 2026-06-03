import type { IUpdateMasterServiceInput } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface IUpdateMasterServiceApplicationInput {
  id: string;
  patch: IUpdateMasterServiceInput;
  actor: IMasterActorInput;
}
