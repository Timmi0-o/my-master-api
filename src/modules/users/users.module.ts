import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../auth/infrastructure/modules/auth-guards/auth-guards.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { FolderModule } from '../files/infrastructure/modules/folder/folder.module';
import { UserProfileModule } from './infrastructure/modules/user-profile/user-profile.module';
import { UserModule } from './infrastructure/modules/user/user.module';
import { UserProfilesController } from './presentation/http/controllers/user-profiles.controller';
import { UsersController } from './presentation/http/controllers/users.controller';

@Module({
  imports: [
    AuthGuardsModule,
    AuthorizationModule,
    UserModule,
    UserProfileModule,
    FolderModule,
  ],
  controllers: [UsersController, UserProfilesController],
  exports: [UserModule, UserProfileModule],
})
export class UsersModule {}
