import { FolderSystemType } from '../file/file.enums';
import type { FilePurpose } from '../file/file.enums';

export interface IFolderEntity {
  id: string;
  ownerKind: string;
  ownerId: string;
  createdBy: string;
  name: string;
  parentId: string | null;
  path: string;
  depth: number;
  isSystem: boolean;
  systemType: FolderSystemType | null;
  allowedPurposes: FilePurpose[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ICreateFolderInput {
  ownerKind: string;
  ownerId: string;
  createdBy: string;
  name: string;
  parentId?: string | null;
  path: string;
  depth: number;
  isSystem?: boolean;
  systemType?: FolderSystemType | null;
  allowedPurposes?: FilePurpose[];
}

export interface IUpdateFolderInput {
  name?: string;
  parentId?: string | null;
  path?: string;
  depth?: number;
  allowedPurposes?: FilePurpose[];
}
