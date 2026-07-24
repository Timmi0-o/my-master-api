import type { IFilePublicEntity } from 'src/modules/files/domain/entities/file';

export type IProfileAvatarView = {
  id: string;
  fileId: string;
  file?: IFilePublicEntity;
};
