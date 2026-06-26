import type { IAppointmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment';
import type { IMasterServicePublicEntity } from '../master-service';

export type IMasterServiceReviewClientUserPublic = {
  id: string;
  username: string;
  name: string;
  surname: string;
  patronymic?: string | null;
};

export interface IMasterServiceReviewRelations {
  masterService?: IMasterServicePublicEntity;
  clientUser?: IMasterServiceReviewClientUserPublic;
  appointment?: IAppointmentPublicEntity;
}
