import { Module, forwardRef } from '@nestjs/common';
import { CreateFileShareUseCase } from '../../../application/use-cases/file-share/create-file-share.use-case';
import { GetFileShareUseCase } from '../../../application/use-cases/file-share/get-file-share.use-case';
import { RevokeFileShareUseCase } from '../../../application/use-cases/file-share/revoke-file-share.use-case';
import { FILE_ACCESS_REPOSITORY_TOKEN } from '../../../domain/repositories/file-access/file-access.repository.tokens';
import type { IFileAccessRepository } from '../../../domain/repositories/file-access/i-file-access.repository';
import { FILE_REPOSITORY_TOKEN } from '../../../domain/repositories/file/file.repository.tokens';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import { FILE_SHARE_REPOSITORY_TOKEN } from '../../../domain/repositories/file-share/file-share.repository.tokens';
import type { IFileShareRepository } from '../../../domain/repositories/file-share/i-file-share.repository';
import { PrismaFileShareRepository } from '../../persistence/repositories/file-share/prisma-file-share.repository';
import { FileModule } from '../file/file.module';

@Module({
  imports: [forwardRef(() => FileModule)],
  providers: [
    {
      provide: FILE_SHARE_REPOSITORY_TOKEN,
      useClass: PrismaFileShareRepository,
    },
    {
      provide: CreateFileShareUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        shareRepo: IFileShareRepository,
        fileAccessRepo: IFileAccessRepository,
      ) => new CreateFileShareUseCase(fileRepo, shareRepo, fileAccessRepo),
      inject: [
        FILE_REPOSITORY_TOKEN,
        FILE_SHARE_REPOSITORY_TOKEN,
        FILE_ACCESS_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetFileShareUseCase,
      useFactory: (
        shareRepo: IFileShareRepository,
        fileRepo: IFileRepository,
      ) => new GetFileShareUseCase(shareRepo, fileRepo),
      inject: [FILE_SHARE_REPOSITORY_TOKEN, FILE_REPOSITORY_TOKEN],
    },
    {
      provide: RevokeFileShareUseCase,
      useFactory: (
        shareRepo: IFileShareRepository,
        fileRepo: IFileRepository,
        fileAccessRepo: IFileAccessRepository,
      ) => new RevokeFileShareUseCase(shareRepo, fileRepo, fileAccessRepo),
      inject: [
        FILE_SHARE_REPOSITORY_TOKEN,
        FILE_REPOSITORY_TOKEN,
        FILE_ACCESS_REPOSITORY_TOKEN,
      ],
    },
  ],
  exports: [
    FILE_SHARE_REPOSITORY_TOKEN,
    CreateFileShareUseCase,
    GetFileShareUseCase,
    RevokeFileShareUseCase,
  ],
})
export class FileShareModule {}
