import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../auth/infrastructure/modules/auth-guards/auth-guards.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { FileShareModule } from './infrastructure/modules/file-share/file-share.module';
import { FileModule } from './infrastructure/modules/file/file.module';
import { FilesInternalModule } from './infrastructure/modules/files-internal/files-internal.module';
import { FolderModule } from './infrastructure/modules/folder/folder.module';
import { FileSharesController } from './presentation/http/controllers/file-shares.controller';
import { FilesInternalController } from './presentation/http/controllers/files-internal.controller';
import { FilesController } from './presentation/http/controllers/files.controller';
import { FoldersController } from './presentation/http/controllers/folders.controller';

@Module({
  imports: [
    AuthGuardsModule,
    AuthorizationModule,
    FileModule,
    FolderModule,
    FileShareModule,
    FilesInternalModule,
  ],
  controllers: [
    FilesController,
    FoldersController,
    FileSharesController,
    FilesInternalController,
  ],
  exports: [FileModule, FolderModule, FileShareModule, FilesInternalModule],
})
export class FilesModule {}
