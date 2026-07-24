import type { IProfileAvatarView } from 'src/modules/masters/domain/entities/image';

export type IUserProfileRelations = {
  avatar?: IProfileAvatarView | null;
};
