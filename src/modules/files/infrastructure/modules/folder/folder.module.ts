import { Module, forwardRef } from '@nestjs/common';
import { CreateFolderUseCase } from '../../../application/use-cases/folder/create-folder.use-case';
import { CreateRootFolderUseCase } from '../../../application/use-cases/folder/create-root-folder.use-case';
import { DeleteFolderUseCase } from '../../../application/use-cases/folder/delete-folder.use-case';
import { GetFolderUseCase } from '../../../application/use-cases/folder/get-folder.use-case';
import { MoveFolderUseCase } from '../../../application/use-cases/folder/move-folder.use-case';
import { UpdateFolderUseCase } from '../../../application/use-cases/folder/update-folder.use-case';
import { FILE_REPOSITORY_TOKEN } from '../../../domain/repositories/file/file.repository.tokens';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import { FOLDER_REPOSITORY_TOKEN } from '../../../domain/repositories/folder/folder.repository.tokens';
import type { IFolderRepository } from '../../../domain/repositories/folder/i-folder.repository';
import { PrismaFolderRepository } from '../../persistence/repositories/folder/prisma-folder.repository';
import { FileModule } from '../file/file.module';

@Module({
  imports: [forwardRef(() => FileModule)],
  providers: [
    {
      provide: FOLDER_REPOSITORY_TOKEN,
      useClass: PrismaFolderRepository,
    },
    {
      provide: GetFolderUseCase,
      useFactory: (folderRepo: IFolderRepository) =>
        new GetFolderUseCase(folderRepo),
      inject: [FOLDER_REPOSITORY_TOKEN],
    },
    {
      provide: CreateFolderUseCase,
      useFactory: (folderRepo: IFolderRepository) =>
        new CreateFolderUseCase(folderRepo),
      inject: [FOLDER_REPOSITORY_TOKEN],
    },
    {
      provide: CreateRootFolderUseCase,
      useFactory: (folderRepo: IFolderRepository) =>
        new CreateRootFolderUseCase(folderRepo),
      inject: [FOLDER_REPOSITORY_TOKEN],
    },
    {
      provide: UpdateFolderUseCase,
      useFactory: (folderRepo: IFolderRepository) =>
        new UpdateFolderUseCase(folderRepo),
      inject: [FOLDER_REPOSITORY_TOKEN],
    },
    {
      provide: MoveFolderUseCase,
      useFactory: (folderRepo: IFolderRepository) =>
        new MoveFolderUseCase(folderRepo),
      inject: [FOLDER_REPOSITORY_TOKEN],
    },
    {
      provide: DeleteFolderUseCase,
      useFactory: (
        folderRepo: IFolderRepository,
        fileRepo: IFileRepository,
      ) => new DeleteFolderUseCase(folderRepo, fileRepo),
      inject: [FOLDER_REPOSITORY_TOKEN, FILE_REPOSITORY_TOKEN],
    },
  ],
  exports: [
    FOLDER_REPOSITORY_TOKEN,
    GetFolderUseCase,
    CreateFolderUseCase,
    CreateRootFolderUseCase,
    UpdateFolderUseCase,
    MoveFolderUseCase,
    DeleteFolderUseCase,
  ],
})
export class FolderModule {}
