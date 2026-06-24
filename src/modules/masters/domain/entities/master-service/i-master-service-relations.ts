import type { IMasterProfilePublicEntity } from '../master-profile';
import type { IMasterServiceImagePublicEntity } from '../master-service-image';

export type IMasterServiceRelations = {
  masterProfile: IMasterProfilePublicEntity;
  images?: IMasterServiceImagePublicEntity[];
};
