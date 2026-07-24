import type { ReadResult } from 'src/modules/shared/domain/query';
import type { IProfileAvatarView } from 'src/modules/masters/domain/entities/image';
import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import type {
  IUserProfilePublicEntity,
  IUserProfileRelations,
} from 'src/modules/users/domain/entities/user-profile';
import type { IAppointmentChatPublicEntity } from '../appointment-chat';

export type IAppointmentMasterProfileRelations = {
  avatar?: IProfileAvatarView | null;
};

export type IAppointmentClientUserRelations = {
  userProfile?: ReadResult<IUserProfilePublicEntity, IUserProfileRelations>;
};

export type IAppointmentRelations = {
  masterProfile: ReadResult<
    IMasterProfilePublicEntity,
    IAppointmentMasterProfileRelations
  >;
  masterService: IMasterServicePublicEntity;
  clientUser: ReadResult<IUserPublicEntity, IAppointmentClientUserRelations>;
  chat: IAppointmentChatPublicEntity;
};
