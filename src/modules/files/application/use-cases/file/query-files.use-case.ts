import type { IQueryFilesApplicationInput } from '../../dtos/file/query-files.input';
import type { IQueryFilesApplicationOutput } from '../../dtos/file/query-files.output';
import type { IFilePublicEntity } from '../../../domain/entities/file';
import { isFileAccessible } from '../../../domain/entities/file/policies/ensure-file-accessible.policy';
import type { IFileAccessRepository } from '../../../domain/repositories/file-access/i-file-access.repository';
import type { IFileShareRepository } from '../../../domain/repositories/file-share/i-file-share.repository';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';

export class QueryFilesUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly fileAccessRepository: IFileAccessRepository,
    private readonly fileShareRepository: IFileShareRepository,
  ) {}

  async execute(
    input: IQueryFilesApplicationInput,
  ): Promise<IQueryFilesApplicationOutput> {
    const [rows, total] = await Promise.all([
      this.fileRepository.findMany(input.params),
      this.fileRepository.count({ where: input.params.where }),
    ]);

    const data: IFilePublicEntity[] = [];
    for (const file of rows) {
      const allowed = await isFileAccessible(file, input.actor, {
        fileAccessRepository: this.fileAccessRepository,
        fileShareRepository: this.fileShareRepository,
      });
      if (allowed) {
        data.push(file);
      }
    }

    return { data, meta: { total } };
  }
}
