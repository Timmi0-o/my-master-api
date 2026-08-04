import type { IProfileAvatarView } from 'src/modules/masters/domain/entities/image';

export type INotificationActorUserProfilePublic = {
  id: string;
  userId?: string;
  displayName?: string;
  avatar?: IProfileAvatarView | null;
};

export type INotificationActorUserPublic = {
  id: string;
  username: string;
  name: string;
  surname: string;
  patronymic?: string | null;
  userProfile?: INotificationActorUserProfilePublic | null;
};

export interface INotificationRelations {
  actor?: INotificationActorUserPublic | null;
}
