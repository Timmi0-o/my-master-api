import type { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface ICreateMasterServiceApplicationInput {
  masterProfileId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes?: number;
  category?: EMasterServiceCategory;
  tags: string[];
  actor: IMasterActorInput;
}
