import type { IFileEntity } from '../../../domain/entities/file';

export function mapFileToHttpResponse(file: IFileEntity) {
  return {
    ...file,
    fileSize: Number(file.fileSize),
  };
}

export function mapFilesToHttpResponse(files: IFileEntity[]) {
  return files.map(mapFileToHttpResponse);
}
