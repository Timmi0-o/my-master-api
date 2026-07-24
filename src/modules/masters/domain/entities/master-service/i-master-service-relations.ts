import type { IFilePublicEntity } from 'src/modules/files/domain/entities/file';
import type { ReadResult } from 'src/modules/shared/domain/query';
import type { IProfileAvatarView } from '../image';
import type { IMasterProfilePublicEntity } from '../master-profile';

/**
 * Service-facing image shape kept for HTTP/frontend compatibility.
 * Backed by polymorphic Image rows with entityType=MASTER_SERVICE.
 */
export type IMasterServiceImageView = {
  id: string;
  masterServiceId: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
  file?: IFilePublicEntity;
};

export type IMasterServiceMasterProfileRelations = {
  avatar?: IProfileAvatarView | null;
};

export type IMasterServiceMasterProfileView = ReadResult<
  IMasterProfilePublicEntity,
  IMasterServiceMasterProfileRelations
>;

export type IMasterServiceRelations = {
  masterProfile: IMasterServiceMasterProfileView;
  images?: IMasterServiceImageView[];
};
