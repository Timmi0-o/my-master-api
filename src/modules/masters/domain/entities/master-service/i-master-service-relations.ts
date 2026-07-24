import type { IFilePublicEntity } from 'src/modules/files/domain/entities/file';
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

export type IMasterServiceRelations = {
  masterProfile: IMasterProfilePublicEntity;
  images?: IMasterServiceImageView[];
};
