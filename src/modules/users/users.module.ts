import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../auth/infrastructure/modules/auth-guards/auth-guards.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { FolderModule } from '../files/infrastructure/modules/folder/folder.module';
import { UserBlockModule } from './infrastructure/modules/user-block/user-block.module';
import { UserProfileModule } from './infrastructure/modules/user-profile/user-profile.module';
import { UserModule } from './infrastructure/modules/user/user.module';
import { UserBlocksController } from './presentation/http/controllers/user-blocks.controller';
import { UserProfilesController } from './presentation/http/controllers/user-profiles.controller';
import { UsersController } from './presentation/http/controllers/users.controller';

@Module({
  imports: [
    AuthGuardsModule,
    AuthorizationModule,
    UserModule,
    UserProfileModule,
    UserBlockModule,
    FolderModule,
  ],
  controllers: [UsersController, UserProfilesController, UserBlocksController],
  exports: [UserModule, UserProfileModule, UserBlockModule],
})
export class UsersModule {}
