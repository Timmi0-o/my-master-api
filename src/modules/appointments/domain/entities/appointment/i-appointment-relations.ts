import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import type { IAppointmentChatPublicEntity } from '../appointment-chat';

export type IAppointmentRelations = {
  masterProfile: IMasterProfilePublicEntity;
  masterService: IMasterServicePublicEntity;
  clientUser: IUserPublicEntity;
  chat?: IAppointmentChatPublicEntity | null;
};
