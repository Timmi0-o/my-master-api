import type { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';

export interface ICreateMasterServicePayload {
  masterProfileId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes?: number;
  category?: EMasterServiceCategory;
}
