import { FileNotFoundError } from '../errors/file.errors';
import type { IFileEntity } from '../i-file.entity';

export function ensureFileExists(
  file: IFileEntity | null | undefined,
  fileId: string,
): asserts file is IFileEntity {
  if (!file || file.deletedAt) {
    throw new FileNotFoundError(fileId);
  }
}
